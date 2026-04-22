"use client";

import { useEffect, useRef } from "react";
import type * as MatterNS from "matter-js";

// Tesoro-style: clean coloured octagons in 5 brand families. No
// letters, hearts, or paws — variety comes from colour + size +
// rotation only. Weighted toward teal so the brand colour dominates.
const COLORS = [
  "#1f6e6a", // teal
  "#f08c70", // coral
  "#f3dc6e", // mustard
  "#e76e70", // rose
  "#f6c4c1", // pink
  "#1f6e6a", // teal again
  "#f08c70",
];

const COUNT = 18;

type ShapeBody = MatterNS.Body & {
  _color?: string;
  _radius?: number;
};

/**
 * Matter.js physics canvas pinned to the lower portion of the footer.
 * Drops a pile of solid coloured octagons that settle on top of the
 * "hamstr" wordmark. Initialises lazily via IntersectionObserver.
 *
 * Design goals:
 *   - Reliable across Chrome / Safari / Firefox, mouse + touch + pen
 *   - Crisp on any DPR (retina, 4K, Windows 125% scaling)
 *   - Survives container resizes (font swap, layout shift, image load)
 *   - Honours prefers-reduced-motion as a static no-op
 *   - No memory leaks on hot reload, route change, or React StrictMode
 */
export function FallingHamstrShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceQuery.matches) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const init = async () => {
      if (cancelled || cleanup) return;

      const Matter = (await import("matter-js")).default;
      if (cancelled) return;
      const { Engine, Runner, World, Bodies, Body, Events } = Matter;

      // --- Sizing -----------------------------------------------------------
      // Wait until layout is ready before initialising. If we measure 0×0 we
      // schedule a retry on the next frame instead of bailing for good — this
      // matters when fonts/images shift the footer height after first paint.
      let width = container.clientWidth;
      let height = container.clientHeight;
      if (width === 0 || height === 0) {
        requestAnimationFrame(() => void init());
        return;
      }

      let dpr = Math.max(1, window.devicePixelRatio || 1);
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const sizeCanvas = () => {
        // Internal pixel buffer is DPR-scaled for crisp rendering, but the
        // CSS box stays at logical size. We then `setTransform` so all draw
        // calls operate in CSS pixel units.
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      sizeCanvas();

      // --- Physics world ----------------------------------------------------
      const engine = Engine.create({ gravity: { x: 0, y: 1.6 } });

      // Walls are oversized so bodies can't slip through corners during
      // resize and are easy to reposition.
      const WALL = 200;
      const floor = Bodies.rectangle(
        width / 2,
        height + WALL / 2,
        Math.max(width, 200) * 4,
        WALL,
        { isStatic: true, friction: 0.4 },
      );
      const left = Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, {
        isStatic: true,
      });
      const right = Bodies.rectangle(
        width + WALL / 2,
        height / 2,
        WALL,
        height * 4,
        { isStatic: true },
      );
      World.add(engine.world, [floor, left, right]);

      const shapes: ShapeBody[] = [];

      // Stagger the drops so the pile builds up rather than appearing all at
      // once. Each octagon is a clean convex `Bodies.polygon` (8 sides) which
      // avoids the vertex-decomposition warnings (and rare NaN positions) you
      // get from `Bodies.fromVertices` without the optional `poly-decomp` lib.
      const drops: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < COUNT; i++) {
        const t = setTimeout(() => {
          if (cancelled) return;
          const radius = 28 + Math.random() * 32;
          const x = 60 + Math.random() * Math.max(60, width - 120);
          const y = -radius * 2 - Math.random() * 200;
          const body = Bodies.polygon(x, y, 8, radius, {
            restitution: 0.55,
            friction: 0.05,
            frictionAir: 0.012,
            density: 0.0018,
            // Start angled so flats land naturally and the pile reads as
            // "rotated tiles" rather than perfectly aligned bricks.
            angle: (Math.random() - 0.5) * 0.6,
          }) as ShapeBody;
          body._color = COLORS[i % COLORS.length];
          body._radius = radius;
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
          World.add(engine.world, body);
          shapes.push(body);
        }, 70 * i);
        drops.push(t);
      }

      // --- Drag (PointerEvents — mouse + touch + pen, all browsers) ---------
      // We deliberately avoid Matter's `Mouse` + `MouseConstraint` because
      // they rely on a brittle DPR/offset calculation that breaks on retina,
      // page zoom, and monitor changes. Native pointer events + a manual
      // velocity-target approach is far more reliable.
      let dragBody: ShapeBody | null = null;
      let dragOffsetX = 0;
      let dragOffsetY = 0;
      let pointerX = 0;
      let pointerY = 0;
      let lastCursor = "";

      const setCursor = (next: string) => {
        if (lastCursor === next) return;
        lastCursor = next;
        canvas.style.cursor = next;
      };
      setCursor("grab");

      const localPos = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        // Hit-test is in CSS pixels — the same coordinate space the physics
        // world lives in (because we apply `setTransform(dpr,...)` to ctx).
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const hitTest = (px: number, py: number): ShapeBody | null => {
        // Iterate newest first so freshly dropped pieces (visually on top)
        // grab priority, mirroring stacking order.
        for (let i = shapes.length - 1; i >= 0; i--) {
          const b = shapes[i];
          const r = (b._radius || 40) + 4; // 4px slop for forgiving grabs
          const dx = b.position.x - px;
          const dy = b.position.y - py;
          if (dx * dx + dy * dy <= r * r) return b;
        }
        return null;
      };

      const onPointerDown = (e: PointerEvent) => {
        const { x, y } = localPos(e.clientX, e.clientY);
        const body = hitTest(x, y);
        if (!body) return;
        e.preventDefault();
        dragBody = body;
        dragOffsetX = x - body.position.x;
        dragOffsetY = y - body.position.y;
        pointerX = x;
        pointerY = y;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Some older Safari versions throw on pointer capture; not fatal.
        }
        // Wake the body up and let it move freely while we drag it.
        Body.setStatic(body, false);
        setCursor("grabbing");
      };

      const onPointerMove = (e: PointerEvent) => {
        const { x, y } = localPos(e.clientX, e.clientY);
        pointerX = x;
        pointerY = y;
        if (!dragBody) {
          setCursor(hitTest(x, y) ? "grab" : "default");
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        if (canvas.hasPointerCapture(e.pointerId)) {
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }
        if (!dragBody) return;
        dragBody = null;
        setCursor("default");
      };

      const onPointerLeave = () => {
        if (!dragBody) setCursor("default");
      };

      // Each physics tick, while dragging, drive the body's velocity toward
      // the pointer target. Velocity-based dragging gives a satisfying
      // "throw on release" without any code, because when we set dragBody
      // to null the last computed velocity is preserved.
      Events.on(engine, "beforeUpdate", () => {
        if (!dragBody) return;
        const targetX = pointerX - dragOffsetX;
        const targetY = pointerY - dragOffsetY;
        const dx = targetX - dragBody.position.x;
        const dy = targetY - dragBody.position.y;
        // Cap the per-tick velocity so frantic flicks can't punch bodies
        // through walls or generate NaN states.
        const vx = Math.max(-60, Math.min(60, dx * 0.5));
        const vy = Math.max(-60, Math.min(60, dy * 0.5));
        Body.setVelocity(dragBody, { x: vx, y: vy });
        Body.setAngularVelocity(dragBody, dragBody.angularVelocity * 0.8);
      });

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("pointerleave", onPointerLeave);

      // --- Idle wiggle ------------------------------------------------------
      // Every ~1.5s, give one of the most-settled octagons an upward "hop"
      // so there's always a little life in the pile. Skipped while the user
      // is dragging so we never fight their input.
      const wiggle = window.setInterval(() => {
        if (dragBody || shapes.length === 0) return;
        const settled = shapes.filter(
          (b) => Math.hypot(b.velocity.x, b.velocity.y) < 0.6,
        );
        if (settled.length === 0) return;
        const pick = settled[Math.floor(Math.random() * settled.length)];
        Body.setVelocity(pick, {
          x: (Math.random() - 0.5) * 1.6,
          y: -(5 + Math.random() * 4),
        });
        Body.setAngularVelocity(pick, (Math.random() - 0.5) * 0.22);
      }, 1500);

      // --- Render loop ------------------------------------------------------
      let raf = 0;
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const b of shapes) {
          // Defensive: a NaN/Infinity slipping through would throw inside
          // canvas2d. Skip and let physics correct itself.
          if (
            !Number.isFinite(b.position.x) ||
            !Number.isFinite(b.position.y) ||
            !Number.isFinite(b.angle)
          ) {
            continue;
          }
          const r = b._radius || 40;
          ctx.save();
          ctx.translate(b.position.x, b.position.y);
          ctx.rotate(b.angle);
          ctx.fillStyle = b._color || "#fff";
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = (Math.PI / 4) * i + Math.PI / 8;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        raf = requestAnimationFrame(draw);
      };

      const runner = Runner.create();
      Runner.run(runner, engine);
      raf = requestAnimationFrame(draw);

      // --- Resize handling --------------------------------------------------
      // ResizeObserver fires for any container size change (font swap, image
      // load, viewport resize). We also re-check DPR — important when a user
      // drags the window between a retina laptop and a non-retina monitor.
      const handleResize = () => {
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        const newDpr = Math.max(1, window.devicePixelRatio || 1);
        if (newW === width && newH === height && newDpr === dpr) return;
        width = newW;
        height = newH;
        dpr = newDpr;
        sizeCanvas();
        Body.setPosition(floor, {
          x: width / 2,
          y: height + WALL / 2,
        });
        Body.setPosition(left, { x: -WALL / 2, y: height / 2 });
        Body.setPosition(right, {
          x: width + WALL / 2,
          y: height / 2,
        });
      };
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);
      // DPR can change without container resize (zoom level, window dragged
      // to a different-density monitor). matchMedia fires on any change.
      const dprQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
      const onDprChange = () => handleResize();
      dprQuery.addEventListener("change", onDprChange);

      cleanup = () => {
        drops.forEach(clearTimeout);
        cancelAnimationFrame(raf);
        window.clearInterval(wiggle);
        ro.disconnect();
        dprQuery.removeEventListener("change", onDprChange);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    // Lazy init: don't spin up Matter or the RAF loop until the footer
    // actually scrolls into view. Saves CPU on long pages.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void init();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-auto absolute inset-0 z-20"
      // touch-action:none lets us own the gesture on touchscreens (otherwise
      // the browser captures the drag as a vertical scroll on first move).
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "none",
        }}
      />
    </div>
  );
}

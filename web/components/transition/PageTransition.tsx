"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/components/motion/SmoothScroll";

/**
 * Tesoro-style "curtain" page transition: a full-bleed colored panel
 * sweeps in from below, an octagon-clipped logo pops in, then on route
 * change the panel sweeps off the top.
 *
 * Internal `<a>` clicks are intercepted so we can play the curtain
 * before navigating. External, hash, and modifier-clicks pass through.
 *
 * Skipped entirely under prefers-reduced-motion.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);

  // Reveal on mount + on every pathname change.
  useEffect(() => {
    const curtain = curtainRef.current;
    const logo = logoRef.current;
    if (!curtain || !logo) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(curtain, { autoAlpha: 0 });
      navigatingRef.current = false;
      return;
    }

    // If we just navigated, the curtain is already covering — wipe it off.
    // If this is initial load, do a soft reveal so the first paint is intentional.
    const tl = gsap.timeline({
      onComplete: () => {
        navigatingRef.current = false;
        getLenis()?.start();
        gsap.set(curtain, { yPercent: 0, autoAlpha: 0 });
      },
    });

    tl.set(curtain, { autoAlpha: 1, yPercent: 0 })
      .set(logo, { autoAlpha: 1, scale: 1 })
      .to(logo, { autoAlpha: 0, scale: 0.9, duration: 0.25, ease: "power2.in" })
      .to(
        curtain,
        { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
        "-=0.05",
      );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  // Intercept internal link clicks, play curtain in, then navigate.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      e.preventDefault();
      const dest = url.pathname + url.search + url.hash;
      playCurtainIn(() => {
        router.push(dest);
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  const playCurtainIn = (then: () => void) => {
    const curtain = curtainRef.current;
    const logo = logoRef.current;
    if (!curtain || !logo) {
      then();
      return;
    }
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    getLenis()?.stop();

    gsap.set(curtain, { autoAlpha: 1, yPercent: 100 });
    gsap.set(logo, { autoAlpha: 0, scale: 0.6, rotate: -20 });

    const tl = gsap.timeline({
      onComplete: () => then(),
    });
    tl.to(curtain, { yPercent: 0, duration: 0.55, ease: "expo.inOut" })
      .to(
        logo,
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.4, ease: "back.out(1.6)" },
        "-=0.2",
      )
      // brief hold so the logo registers
      .to({}, { duration: 0.12 });
  };

  return (
    <div
      ref={curtainRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--teal)",
        zIndex: 100,
        opacity: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={logoRef}
        className="clip-octagon"
        style={{
          width: "min(40vw, 220px)",
          aspectRatio: "1 / 1",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hamstr-logo.png"
          alt=""
          style={{ width: "70%", height: "auto" }}
          className="logo-blend"
        />
      </div>
    </div>
  );
}

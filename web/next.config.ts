import type { NextConfig } from "next";

// Hosts allowed to talk to the dev server / HMR websocket. Add any
// tunnel hostname you're previewing through (ngrok, Cloudflare Tunnel,
// Tailscale Funnel, etc.) so Next.js doesn't reject their origin.
// Wildcards are supported.
const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;

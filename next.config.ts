import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  // Allow viewing the dev server through a tunnel (phone testing)
  allowedDevOrigins: ['*.devtunnels.ms', '*.trycloudflare.com'],
  // PWA: the service worker must never be served stale
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
    ]
  },
};

export default nextConfig;

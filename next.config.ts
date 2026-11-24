import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  // Allow viewing the dev server through a tunnel (phone testing)
  allowedDevOrigins: ['*.devtunnels.ms', '*.trycloudflare.com'],
};

export default nextConfig;

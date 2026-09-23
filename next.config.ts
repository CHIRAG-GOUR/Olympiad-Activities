import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
  // Strip console.log/debug/info from production client bundles (keep error/warn so real
  // failures are still visible) — smaller shipped JS and no console overhead at runtime.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Tree-shake per-icon so a `lucide-react` import doesn't pull the whole icon set into
  // every route's chunk — each admin/activity file already imports icons by name.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

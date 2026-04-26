import type { NextConfig } from "next";

// Spec 72 §7 build-time exclusion: dev-only routes are named `*.dev.tsx`
// and only treated as routes when MODE=dev. In prod builds Next.js skips
// them entirely — no compiled chunks, no `decouple:dev:` literals, no
// way for /dev/* to reach the production bundle even if a layout's
// runtime notFound() guard regressed.
const includeDevRoutes =
  process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE !== 'prod';

const nextConfig: NextConfig = {
  pageExtensions: includeDevRoutes
    ? ['dev.tsx', 'dev.ts', 'tsx', 'ts']
    : ['tsx', 'ts'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

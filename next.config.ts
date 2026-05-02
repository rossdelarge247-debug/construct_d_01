import type { NextConfig } from "next";

// pageExtensions excludes *.dev.tsx from prod compilation: Next.js
// skips them entirely (no chunks, no source maps). Layout's runtime
// notFound() guard remains as defence-in-depth.
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

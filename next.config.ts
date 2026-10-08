import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image hosts used by content/*.json. Swap for the college's own CDN when real photography is supplied.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  poweredByHeader: false,
};

export default nextConfig;

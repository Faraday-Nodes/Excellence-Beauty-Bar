import type { NextConfig } from "next";

/* GitHub Pages serves a project repo under /<repo-name>/. The deploy workflow
   sets NEXT_PUBLIC_BASE_PATH to "/<repo-name>" at build time so all asset and
   route URLs are prefixed correctly. Leave it empty for local dev, a user/org
   site (username.github.io), or a custom domain. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // emit a static ./out folder that GitHub Pages can serve
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // GitHub Pages has no image optimizer, so serve images as-is.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

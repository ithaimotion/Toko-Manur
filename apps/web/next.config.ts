import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@toko-manur/types", "@toko-manur/mock-data", "@toko-manur/utils", "@toko-manur/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

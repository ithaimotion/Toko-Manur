import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright", "playwright-core", "chromium-bidi"],
  transpilePackages: ["@toko-manur/types", "@toko-manur/mock-data", "@toko-manur/utils", "@toko-manur/review-sync"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 
        'playwright', 'playwright-core', 'chromium-bidi',
        'playwright-extra', 'playwright-extra-plugin-stealth',
      ];
    }
    return config;
  },
};

export default nextConfig;

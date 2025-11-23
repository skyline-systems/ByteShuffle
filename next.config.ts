import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://aiijacfkmnacrzrsduta.storage.supabase.co/**"),
    ],
  },
};

export default nextConfig;

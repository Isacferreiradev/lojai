import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (imagens de produtos e banners enviadas pelo admin)
      { protocol: "https", hostname: "**.supabase.co" },
      // QR Code do PIX (caso usado via next/image)
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
};

export default nextConfig;

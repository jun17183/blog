import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel이 이전 배포의 .next/cache를 복원하면 Turbopack 빌드 캐시가 바뀐 globals.css를
  // 무효화하지 못해 옛 CSS 청크를 그대로 내보냈다 (2026-09-12, 새 HTML + 옛 CSS).
  // 빌드가 작아 캐시 이득이 없으니 끈다.
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;

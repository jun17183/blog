import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // 로컬 개발 환경에서만 localhost 도메인 추가
    // Vercel에서는 NODE_ENV가 자동으로 'production'으로 설정되므로 제외됨
    ...(process.env.NODE_ENV === 'development' && {
      domains: ['localhost'],
    }),
    // API 라우트에서 이미지 서빙 허용
    unoptimized: true,
  },

  // 빌드 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-markdown', 'jotai'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;

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
    // 로컬 이미지 도메인 추가
    domains: ['localhost'],
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
  
  // 환경 변수 검증
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Vercel 배포를 위한 설정 (Windows에서는 standalone 모드 제외)
  // output: 'standalone',
};

export default nextConfig;

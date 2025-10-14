import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // 미들웨어 로직 (필요시 추가)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /editor 경로는 관리자만 접근 가능
        if (req.nextUrl.pathname.startsWith('/editor')) {
          return token?.isAdmin === true;
        }
        // 다른 경로는 모두 접근 가능
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/editor/:path*',
  ],
};

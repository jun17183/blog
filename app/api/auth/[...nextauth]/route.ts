import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Google OAuth에서 받은 정보를 토큰에 저장
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.sub;
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
        
        // 관리자 권한 확인
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
        token.isAdmin = adminEmails.includes(profile.email || '');
      }
      return token;
    },
    async session({ session, token }) {
      // JWT 토큰의 정보를 세션에 전달
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.accessToken = token.accessToken as string;
        session.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
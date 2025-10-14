import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    isAdmin?: boolean;
  }

  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
    email_verified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    accessToken?: string;
    isAdmin?: boolean;
  }
}
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { Plan } from '@prisma/client';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      plan: Plan;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    plan: Plan;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    plan: Plan;
  }
}

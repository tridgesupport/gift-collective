import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: UpstashRedisAdapter(redis),
    providers: [
        Resend({
            from: 'The Gift Collective <noreply@resend.dev>',
        }),
    ],
    session: { strategy: 'jwt' },
    pages: {
        verifyRequest: '/auth/verify',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.email = user.email;
            return token;
        },
        async session({ session, token }) {
            if (token.email) session.user.email = token.email as string;
            return session;
        },
    },
});

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile, User } from "next-auth";
import { GithubProfile } from "next-auth/providers/github";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        (session.user as any).id = token.sub;
        (session.user as any).username = token.username;
        session.user.image = token.picture;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.sub = profile.id?.toString();
        token.picture = (profile as any).avatar_url;
        token.name = (profile as any).name || (profile as any).login;
        token.username = (profile as any).login;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

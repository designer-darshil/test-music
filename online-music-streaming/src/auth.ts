import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Placeholder for MVP - static login for dev
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin User", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
});

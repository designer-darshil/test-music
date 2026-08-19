import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Note: For MVP, we will use a simple credentials provider.
// In a production app with Auth.js, using an adapter with Prisma is recommended.

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
        // Placeholder for actual authentication logic
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
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
      if (token?.sub) {
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

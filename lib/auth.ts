import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { LoginSchema } from "@/schemas/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        try {
          const user = await db.user.findUnique({
            where: { email }
          });

          // Defensive: Timing Attack Prevention
          // If user does not exist, run a dummy bcrypt compare to prevent timing-based user enumeration.
          if (!user || !user.passwordHash) {
            await bcrypt.compare(
              password,
              "$2y$12$LcYH.Ld8yLpTDrpL/yLPT.n6G5s.lZlX9gJkK4P2K/nB3k9U7J.Wy" // Pre-computed dummy hash
            );
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (!passwordsMatch) {
            return null;
          }

          // SecureGate Rule: Unverified accounts cannot log in
          if (!user.isVerified) {
            throw new Error("UNVERIFIED");
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          // Fail Securely: bubble up verification errors, log other DB/network issues privately
          if (error instanceof Error && error.message === "UNVERIFIED") {
            throw error;
          }
          console.error("Auth process error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

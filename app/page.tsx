import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px", textAlign: "center" }}>
        <div className="auth-header">
          <div className="logo" style={{ fontSize: "28px", marginBottom: "12px" }}>
            SecureGate
          </div>
          <p className="auth-subtitle" style={{ fontSize: "16px", lineHeight: "1.6" }}>
            A production-ready authentication gateway. Built using Next.js 14 App Router, NextAuth, Prisma, and custom in-memory rate limiting.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
          {session ? (
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth" className="btn btn-primary">
                Sign In
              </Link>
              <Link href="/auth" className="btn btn-secondary">
                Create Account
              </Link>
            </>
          )}
        </div>

        <div style={{ marginTop: "32px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>
            Demonstrating timing leak protections, rate limiting, and robust token-based password resets.
          </p>
        </div>
      </div>
    </main>
  );
}

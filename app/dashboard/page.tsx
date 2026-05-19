import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/auth");
  }

  let dbUser = null;
  let dbError = false;

  try {
    dbUser = await db.user.findUnique({
      where: { email: session.user.email },
    });
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
    dbError = true;
  }

  // Defensive: If DB connection is fine but user is unverified/deleted, force log out.
  // If DB connection is down, show a safe degraded state rather than crash (Fail Securely)
  if (!dbError && (!dbUser || !dbUser.isVerified)) {
    redirect("/auth?error=UNVERIFIED");
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="logo">SecureGate</div>
        <SignOutButton />
      </nav>
      <main className="dashboard-main">
        {dbError ? (
          <div className="dashboard-card" style={{ borderColor: "var(--error-border)" }}>
            <h2 className="dashboard-title" style={{ color: "var(--error)", marginBottom: "12px" }}>
              Database Connection Error
            </h2>
            <p className="dashboard-desc" style={{ marginBottom: "16px" }}>
              We verified your session cryptographically via JWT, but we could not complete secondary validation because the PostgreSQL database is unreachable.
            </p>
            <div className="alert alert-error" style={{ fontSize: "12px" }}>
              Please make sure your database is running and configured correctly in your .env file. You can run <code>docker compose up -d</code> in the project directory to launch a local test database.
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2 className="dashboard-title">Airtight Gateways</h2>
            <p className="dashboard-desc">
              This is a highly protected dashboard page. Session verification runs at middleware and database levels.
            </p>
            
            <ul className="user-details">
              <li>
                <span>Session ID</span>
                <span style={{ fontFamily: "monospace", fontSize: "12px" }}>{dbUser?.id}</span>
              </li>
              <li>
                <span>User Email</span>
                <span>{dbUser?.email}</span>
              </li>
              <li>
                <span>Account Status</span>
                <span style={{ color: "var(--success)" }}>Verified & Secure</span>
              </li>
              <li>
                <span>Registered At</span>
                <span>{dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : ""}</span>
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

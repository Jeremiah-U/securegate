"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/auth";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing.");
      setLoading(false);
      return;
    }

    const triggerVerification = async () => {
      try {
        const res = await verifyEmail(token);
        if (res.error) {
          setError(res.error);
        } else if (res.success) {
          setSuccess(res.success);
        }
      } catch (err) {
        console.error("Email verification submission error:", err);
        setError("An unexpected error occurred during email verification.");
      } finally {
        setLoading(false);
      }
    };

    triggerVerification();
  }, [token]);

  return (
    <div className="auth-card" style={{ textAlign: "center" }}>
      <div className="auth-header">
        <h1 className="auth-title">Email Verification</h1>
        <p className="auth-subtitle">Finalizing your account setup</p>
      </div>

      {loading && (
        <div style={{ padding: "20px 0" }}>
          <p style={{ color: "var(--muted)" }}>Validating security token...</p>
        </div>
      )}

      {!loading && error && (
        <div>
          <div className="alert alert-error">{error}</div>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
            The verification token may have expired or is invalid. Please try registering again.
          </p>
          <Link href="/auth" className="btn btn-primary">
            Back to Sign Up
          </Link>
        </div>
      )}

      {!loading && success && (
        <div>
          <div className="alert alert-success">{success}</div>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
            Your account is now active and secure. You can log in below.
          </p>
          <Link href="/auth" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-container">
      <Suspense fallback={
        <div className="auth-card" style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "var(--muted)" }}>Loading verification system...</p>
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}

"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/auth";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) {
      setLoading(false);
      return;
    }

    hasVerified.current = true;

    const triggerVerification = async () => {
      try {
        const res = await verifyEmail(token);
        if (res?.error) {
          setError(res.error);
          setSuccess(null);
        } else if (res?.success) {
          setSuccess(res.success);
          setError(null);
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setError("An unexpected error occurred.");
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    };

    triggerVerification();
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: "20px 0" }}>
        <p style={{ color: "var(--muted)" }}>Validating security token...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
          This link has expired or is invalid. Please request a new one.
        </p>
        <Link href="/resend-verification" className="btn btn-primary">
          Get New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <div className="alert alert-success">{success}</div>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
          Your account is now active. You can sign in below.
        </p>
        <Link href="/auth" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-header">
          <h1 className="auth-title">Email Verification</h1>
          <p className="auth-subtitle">Finalizing your account setup</p>
        </div>
        <Suspense fallback={
          <div style={{ padding: "20px 0" }}>
            <p style={{ color: "var(--muted)" }}>Loading verification system...</p>
          </div>
        }>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { resendVerificationEmail } from "@/actions/auth";

function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsPending(true);

    try {
      const res = await resendVerificationEmail(email);
      if (res.error) {
        if (res.secondsLeft) {
          setCountdown(res.secondsLeft);
        }
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
        setEmail("");
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Resend Verification</h1>
        <p className="auth-subtitle">Get a new verification link for your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="resend-email">Email Address</label>
          <input
            className="form-input"
            id="resend-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending || countdown > 0}
            required
            autoComplete="off"
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isPending || countdown > 0}
          style={{ marginTop: "8px" }}
        >
          {isPending ? "Sending..." : countdown > 0 ? `Resend Link (${countdown}s)` : "Resend Verification Link"}
        </button>
      </form>

      <div className="auth-footer">
        Back to{" "}
        <Link href="/auth" className="auth-link">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <main className="auth-container">
      <Suspense fallback={
        <div className="auth-card" style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      }>
        <ResendVerificationForm />
      </Suspense>
    </main>
  );
}
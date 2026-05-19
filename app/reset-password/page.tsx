"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrength } from "@/components/PasswordStrength";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await resetPassword({ password }, token);
        if (res.error) {
          setError(res.error);
        } else if (res.success) {
          setSuccess(res.success);
          setPassword("");
        }
      } catch (err) {
        console.error("Reset password submission error:", err);
        setError("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">New Password</h1>
        <p className="auth-subtitle">Enter your new secure password</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <PasswordInput
          id="password"
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
        />

        <div style={{ marginBottom: "20px" }}>
          <PasswordStrength password={password} />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <main className="auth-container">
      <Suspense fallback={
        <div className="auth-card" style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "var(--muted)" }}>Loading password gateway...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

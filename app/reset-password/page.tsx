"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordGuidance, setPasswordGuidance] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasCapital = /[A-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasMinLength && hasCapital && hasSpecial && hasNumber;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError("");
    if (value) {
      setPasswordTouched(false);
      if (!validatePassword(value)) {
        setPasswordGuidance("Password must be 8 characters long with capital letter, special character and number");
      } else {
        setPasswordGuidance("");
      }
    } else {
      setPasswordGuidance("");
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    if (!password) {
      setPasswordGuidance("This field cannot be empty");
    }
  };

  const handleConfirmBlur = () => {
    setConfirmTouched(true);
    if (!confirmPassword) {
      setConfirmError("Please confirm your password");
    } else if (confirmPassword !== password) {
      setConfirmError("Passwords do not match");
    }
  };

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

    if (!validatePassword(password)) {
      setPasswordGuidance("Password must be 8 characters long with capital letter, special character and number");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
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
          setConfirmPassword("");
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
          onChange={(e) => handlePasswordChange(e.target.value)}
          onBlur={handlePasswordBlur}
          disabled={isPending}
          required
          autoComplete="new-password"
          title=""
          error={passwordGuidance || undefined}
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => handleConfirmChange(e.target.value)}
          onBlur={handleConfirmBlur}
          disabled={isPending}
          required
          autoComplete="new-password"
          title=""
          error={confirmError || undefined}
        />

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

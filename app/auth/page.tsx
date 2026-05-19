"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { register, forgotPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

type AuthMode = "login" | "register" | "forgot-password";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<AuthMode>("register");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "authenticated") {
      setMode("login");
    }
  }, [status]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "UNVERIFIED") {
      setMode("login");
    }
  }, [searchParams]);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    router.replace("/auth", { scroll: false });
  };

  return (
    <main style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {mode === "login" && (
            <LoginForm
              isPending={isPending}
              startTransition={startTransition}
              onSwitchMode={switchMode}
            />
          )}
          {mode === "register" && (
            <RegisterForm
              isPending={isPending}
              startTransition={startTransition}
              onSwitchMode={switchMode}
            />
          )}
          {mode === "forgot-password" && (
            <ForgotPasswordForm
              isPending={isPending}
              startTransition={startTransition}
              onSwitchMode={switchMode}
            />
          )}
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img
          src="/image/logo.png"
          alt="SecureGate Logo"
          style={{ width: "400px", height: "400px", objectFit: "contain" }}
        />
      </div>
    </main>
  );
}

function LoginForm({
  isPending,
  startTransition,
  onSwitchMode,
}: {
  isPending: boolean;
  startTransition: <T>(fn: () => Promise<T>) => void;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "CredentialsSignin") {
      setError("Invalid email or password.");
    } else if (urlError === "UNVERIFIED") {
      setError("Please verify your email address before signing in.");
    } else if (urlError) {
      setError("An error occurred during authentication.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else if (res.error.includes("UNVERIFIED")) {
          setError("Please verify your email address before signing in.");
        } else {
          setError("Invalid email or password.");
        }
      } else {
        router.push(res?.url || "/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your SecureGate account</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            className="form-input"
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
            autoComplete="off"
            title=""
          />
        </div>

        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
          autoComplete="off"
          title=""
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
            type="button"
            className="auth-link"
            style={{ fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onSwitchMode("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account?{" "}
        <button
          className="auth-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onSwitchMode("register")}
        >
          Create Account
        </button>
      </div>
    </>
  );
}

function RegisterForm({
  isPending,
  startTransition,
  onSwitchMode,
}: {
  isPending: boolean;
  startTransition: <T>(fn: () => Promise<T>) => void;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordGuidance, setPasswordGuidance] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasCapital = /[A-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return hasMinLength && hasCapital && hasSpecial && hasNumber;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please, use a valid email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordGuidance("Password must be 8 characters long with capital letter, special character and number");
    } else {
      setPasswordGuidance("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please, use a valid email");
      return;
    }

    startTransition(async () => {
      const res = await register({ email, password });
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordGuidance("");
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Get started with SecureGate auth system</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">Email Address</label>
          <input
            className="form-input"
            id="register-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            autoComplete="off"
            title=""
          />
          {emailError && (
            <span style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", display: "block" }}>
              {emailError}
            </span>
          )}
        </div>

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          disabled={isPending}
          required
          autoComplete="off"
          title=""
          error={passwordGuidance || undefined}
        />

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{" "}
        <button
          className="auth-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onSwitchMode("login")}
        >
          Sign In
        </button>
      </div>
    </>
  );
}

function ForgotPasswordForm({
  isPending,
  startTransition,
  onSwitchMode,
}: {
  isPending: boolean;
  startTransition: <T>(fn: () => Promise<T>) => void;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    startTransition(async () => {
      const res = await forgotPassword({ email });
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
        setEmail("");
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Request a secure password reset link</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="forgot-email">Email Address</label>
          <input
            className="form-input"
            id="forgot-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
            autoComplete="off"
            title=""
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isPending}
          style={{ marginTop: "8px" }}
        >
          {isPending ? "Sending Reset Link..." : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-footer">
        Back to{" "}
        <button
          className="auth-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onSwitchMode("login")}
        >
          Sign In
        </button>
      </div>
    </>
  );
}
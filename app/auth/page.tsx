"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { register, forgotPassword, resendVerificationEmail } from "@/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

type AuthMode = "login" | "register" | "forgot-password" | "resend-verification" | "reset-sent";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [mode, setMode] = useState<AuthMode>("register");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
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

  const switchMode = (newMode: AuthMode, email?: string) => {
    if (email) {
      setRegisteredEmail(email);
    }
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
          {mode === "resend-verification" && (
            <ResendVerificationForm
              email={registeredEmail}
              isPending={isPending}
              startTransition={startTransition}
              onSwitchMode={switchMode}
            />
          )}
          {mode === "reset-sent" && (
            <ResetSentForm
              email={registeredEmail}
              isPending={isPending}
              startTransition={startTransition}
              onSwitchMode={switchMode}
            />
          )}
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Image
          src="/image/securegate-logo.png"
          alt="SecureGate Logo"
          width={400}
          height={400}
          style={{ objectFit: "contain" }}
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
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError("");
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("This field cannot be empty");
    }
  };

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
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            disabled={isPending}
            required
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
          id="login-password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          disabled={isPending}
          required
          autoComplete="off"
          title=""
          error={!password ? "This field cannot be empty" : undefined}
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
  onSwitchMode: (mode: AuthMode, email?: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordGuidance, setPasswordGuidance] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [countdown, setCountdown] = useState(0);

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
    if (error) setError("");
    if (value) {
      if (!validateEmail(value)) {
        setEmailError("Please, use a valid email");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError("");
    if (value) {
      if (!validatePassword(value)) {
        setPasswordGuidance("Password must be 8 characters long with capital letter, special character and number");
      } else {
        setPasswordGuidance("");
      }
    } else {
      setPasswordGuidance("");
    }
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("This field cannot be empty");
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordGuidance("This field cannot be empty");
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
        if (res.secondsLeft) {
          setCountdown(res.secondsLeft);
        }
        setError(res.error);
      } else if (res.success) {
        onSwitchMode("resend-verification", email);
      }
    });
  };

  const isCooldown = countdown > 0 && error && error.includes("wait");

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Get started with SecureGate auth system</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && !isCooldown && <div className="alert alert-error">{error}</div>}
        {isCooldown && (
          <div className="alert alert-info">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">Email Address</label>
          <input
            className="form-input"
            id="register-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            disabled={isPending || countdown > 0}
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
          onBlur={handlePasswordBlur}
          disabled={isPending}
          required
          autoComplete="off"
          title=""
          error={passwordGuidance || undefined}
        />

        <button className="btn btn-primary" type="submit" disabled={isPending || countdown > 0}>
          {isPending ? "Creating Account..." : countdown > 0 ? `Wait ${countdown}s` : "Create Account"}
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
  onSwitchMode: (mode: AuthMode, email?: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    startTransition(async () => {
      const res = await forgotPassword({ email });
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        onSwitchMode("reset-sent", email);
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
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
          {isPending ? "Sending..." : "Send Reset Link"}
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

function ResendVerificationForm({
  email,
  isPending,
  startTransition,
  onSwitchMode,
}: {
  email: string;
  isPending: boolean;
  startTransition: <T>(fn: () => Promise<T>) => void;
  onSwitchMode: (mode: AuthMode, email?: string) => void;
}) {
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setError("");
    startTransition(async () => {
      const res = await resendVerificationEmail(email);
      if (res.error) {
        if (res.secondsLeft) {
          setCountdown(res.secondsLeft);
        }
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Check Your Inbox</h1>
        <p className="auth-subtitle">We sent a verification link to:</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-info">{error}</div>}

      <div style={{ 
        padding: "16px", 
        background: "var(--background)", 
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        marginBottom: "24px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "500"
      }}>
        {email}
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
        Click the link in your email to verify your account. If you don&apos;t see it, check your spam folder.
      </p>

      <button
        className="btn btn-primary"
        type="button"
        onClick={handleResend}
        disabled={isPending || countdown > 0}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        {isPending ? "Sending..." : countdown > 0 ? `Resend Link (${countdown}s)` : "Resend Verification Link"}
      </button>

      <div className="auth-footer">
        Wrong email?{" "}
        <button
          className="auth-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onSwitchMode("register")}
        >
          Sign up again
        </button>
      </div>
    </>
  );
}

function ResetSentForm({
  email,
  isPending,
  startTransition,
  onSwitchMode,
}: {
  email: string;
  isPending: boolean;
  startTransition: <T>(fn: () => Promise<T>) => void;
  onSwitchMode: (mode: AuthMode, email?: string) => void;
}) {
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setError("");
    startTransition(async () => {
      const res = await forgotPassword({ email });
      if (res.error) {
        if (res.secondsLeft) {
          setCountdown(res.secondsLeft);
        }
        setError(res.error);
      } else if (res.success) {
        setSuccess("Reset link sent again!");
      }
    });
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Check Your Inbox</h1>
        <p className="auth-subtitle">We sent a password reset link to:</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-info">{error}</div>}

      <div style={{
        padding: "16px",
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        marginBottom: "24px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "500"
      }}>
        {email}
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
        Click the link in your email to reset your password. Check your spam folder if you don&apos;t see it.
      </p>

      <button
        className="btn btn-primary"
        type="button"
        onClick={handleResend}
        disabled={isPending || countdown > 0}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        {isPending ? "Sending..." : countdown > 0 ? `Resend Reset Link (${countdown}s)` : "Resend Reset Link"}
      </button>

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

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
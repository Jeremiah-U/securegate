"use client";

import React, { useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = "Password", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="form-input"
            style={{ paddingRight: "45px" }}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--muted)",
              padding: "4px 8px",
              userSelect: "none",
            }}
            tabIndex={-1} // Exclude from normal keyboard tab flow for convenience
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && (
          <span style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", display: "block" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

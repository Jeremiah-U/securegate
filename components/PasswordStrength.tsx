"use client";

import React from "react";

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = "" }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Weak";
  let colorClass = "weak";
  let activeBars = 1;

  if (score >= 5) {
    label = "Strong";
    colorClass = "strong";
    activeBars = 4;
  } else if (score >= 4) {
    label = "Good";
    colorClass = "good";
    activeBars = 3;
  } else if (score >= 2) {
    label = "Fair";
    colorClass = "fair";
    activeBars = 2;
  }

  return (
    <div className="password-strength">
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", marginBottom: "2px" }}>
        <span>Strength</span>
        <span style={{ fontWeight: 600 }}>{label}</span>
      </div>
      <div className="password-strength-bars">
        <div className={`password-strength-bar ${activeBars >= 1 ? colorClass : ""}`} />
        <div className={`password-strength-bar ${activeBars >= 2 ? colorClass : ""}`} />
        <div className={`password-strength-bar ${activeBars >= 3 ? colorClass : ""}`} />
        <div className={`password-strength-bar ${activeBars >= 4 ? colorClass : ""}`} />
      </div>
    </div>
  );
};

"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="btn btn-secondary"
      style={{ width: "auto", padding: "6px 12px", fontSize: "13px" }}
      onClick={() => signOut({ callbackUrl: "/auth" })}
    >
      Sign Out
    </button>
  );
}

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends an email verification link. Mocks to console if RESEND_API_KEY is not defined.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  if (!resend) {
    console.log("\n========================================================");
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Subject: Verify your email address`);
    console.log(`[MOCK EMAIL] Verification Link: ${confirmLink}`);
    console.log("========================================================\n");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "SecureGate Auth <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #1a1a1a;">Verify your email address</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">Thank you for registering at SecureGate. Please click the button below to verify your email address.</p>
          <div style="margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #999999; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend verification email error:", error);
      throw new Error("Failed to send verification email");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Resend verification email exception:", err);
    throw err;
  }
}

/**
 * Sends a password reset link. Mocks to console if RESEND_API_KEY is not defined.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  if (!resend) {
    console.log("\n========================================================");
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Subject: Reset your password`);
    console.log(`[MOCK EMAIL] Reset Link: ${resetLink}`);
    console.log("========================================================\n");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "SecureGate Auth <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #1a1a1a;">Reset your password</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Please click the button below to set a new password.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #999999; font-size: 14px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend reset email error:", error);
      throw new Error("Failed to send reset email");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Resend reset email exception:", err);
    throw err;
  }
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "SecureGate <noreply@gmail.com>",
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

    return { success: true };
  } catch (err) {
    console.error("Send verification email error:", err);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "SecureGate <noreply@gmail.com>",
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

    return { success: true };
  } catch (err) {
    console.error("Send reset email error:", err);
    throw new Error("Failed to send reset email");
  }
}

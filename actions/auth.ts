"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/schemas/auth";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

/**
 * Handles secure user registration.
 */
export async function register(values: z.infer<typeof RegisterSchema>) {
  // 1. Rate Limiting check (IP-based)
  const ip = headers().get("x-forwarded-for") || "127.0.0.1";
  const limitResult = rateLimit(`register:${ip}`, 5, 60 * 1000); // 5 attempts per minute
  if (!limitResult.success) {
    return { error: "Too many registration attempts. Please try again later." };
  }

  // 2. Server-side validation
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { email, password } = validatedFields.data;

  try {
    // 3. Check for existing duplicate email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use." };
    }

    // 4. Secure hashing
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create user (unverified by default)
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        isVerified: false,
      },
    });

    // 6. Generate token & send verification email
    const verificationToken = await generateVerificationToken(user.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent. Please check your inbox." };
  } catch (error) {
    console.error("Register Server Action Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Handles verifying an email using a security token.
 */
export async function verifyEmail(token: string) {
  if (!token) {
    return { error: "Missing token." };
  }

  try {
    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or non-existent token." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired." };
    }

    const existingUser = await db.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { error: "Associated user email does not exist." };
    }

    // Mark verified
    await db.user.update({
      where: { id: existingUser.id },
      data: { isVerified: true },
    });

    // Securely invalidate the token after use
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Email verified successfully!" };
  } catch (error) {
    console.error("Verify Email Error:", error);
    return { error: "Something went wrong." };
  }
}

/**
 * Handles secure request for password reset.
 */
export async function forgotPassword(values: z.infer<typeof ForgotPasswordSchema>) {
  // 1. Rate Limiting check
  const ip = headers().get("x-forwarded-for") || "127.0.0.1";
  const limitResult = rateLimit(`forgot-password:${ip}`, 3, 60 * 1000); // 3 attempts per minute
  if (!limitResult.success) {
    return { error: "Too many requests. Please try again later." };
  }

  // 2. Validate email
  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email." };
  }

  const { email } = validatedFields.data;

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    // Security: Do NOT leak whether an email exists or not.
    // Always return the exact same generic success message.
    if (!user) {
      return { success: "If that email exists in our system, we've sent a password reset link." };
    }

    const resetToken = await generatePasswordResetToken(user.email);
    await sendPasswordResetEmail(resetToken.email, resetToken.token);

    return { success: "If that email exists in our system, we've sent a password reset link." };
  } catch (error) {
    console.error("Forgot Password Action Error:", error);
    return { error: "Something went wrong." };
  }
}

/**
 * Handles completing the password reset using a token.
 */
export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema>,
  token: string | null
) {
  if (!token) {
    return { error: "Missing token." };
  }

  // 1. Validate fields
  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid password requirements." };
  }

  const { password } = validatedFields.data;

  try {
    const existingToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or non-existent token." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired." };
    }

    const existingUser = await db.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { error: "User email does not exist." };
    }

    // Securely hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password
    await db.user.update({
      where: { id: existingUser.id },
      data: { passwordHash },
    });

    // Invalidate token after successful reset
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Password reset successfully!" };
  } catch (error) {
    console.error("Reset Password Action Error:", error);
    return { error: "Something went wrong." };
  }
}

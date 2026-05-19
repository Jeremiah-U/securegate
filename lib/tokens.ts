import { db } from "./db";
import crypto from "crypto";

/**
 * Generates a cryptographically secure 1-hour email verification token, cleaning up previous ones.
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

  try {
    // Check if a token already exists for this email and delete it
    const existingToken = await db.verificationToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }

    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  } catch (err) {
    console.error("Error generating verification token:", err);
    throw new Error("Failed to process security token. Database down?");
  }
}

/**
 * Generates a cryptographically secure 1-hour password reset token, cleaning up previous ones.
 */
export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

  try {
    // Check if a token already exists for this email and delete it
    const existingToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    }

    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return passwordResetToken;
  } catch (err) {
    console.error("Error generating password reset token:", err);
    throw new Error("Failed to process security token. Database down?");
  }
}

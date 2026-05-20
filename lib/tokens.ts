import { db } from "./db";
import crypto from "crypto";

const TOKEN_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown

export class TokenCooldownError extends Error {
  constructor(public secondsLeft: number) {
    super(`Please wait ${secondsLeft} seconds before requesting another email.`);
    this.name = "TokenCooldownError";
  }
}

function isWithinCooldown(lastSentAt: Date): { active: boolean; secondsLeft: number } {
  const msSinceLastSent = Date.now() - lastSentAt.getTime();
  if (msSinceLastSent < TOKEN_COOLDOWN_MS) {
    const secondsLeft = Math.ceil((TOKEN_COOLDOWN_MS - msSinceLastSent) / 1000);
    return { active: true, secondsLeft };
  }
  return { active: false, secondsLeft: 0 };
}

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000);

  try {
    const existingToken = await db.verificationToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      const withinCooldown = isWithinCooldown(new Date(existingToken.lastSentAt));
      if (withinCooldown.active) {
        throw new TokenCooldownError(withinCooldown.secondsLeft);
      }
      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }

    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
        lastSentAt: new Date(),
      },
    });

    return verificationToken;
  } catch (err) {
    if (err instanceof TokenCooldownError) throw err;
    console.error("Error generating verification token:", err);
    throw new Error("Failed to process security token. Database down?");
  }
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000);

  try {
    const existingToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      const withinCooldown = isWithinCooldown(new Date(existingToken.lastSentAt));
      if (withinCooldown.active) {
        throw new TokenCooldownError(withinCooldown.secondsLeft);
      }
      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    }

    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
        lastSentAt: new Date(),
      },
    });

    return passwordResetToken;
  } catch (err) {
    if (err instanceof TokenCooldownError) throw err;
    console.error("Error generating password reset token:", err);
    throw new Error("Failed to process security token. Database down?");
  }
}

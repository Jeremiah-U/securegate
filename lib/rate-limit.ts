interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Custom in-memory rate limiter (Fixed-window algorithm).
 * @param key Unique identifier (e.g., IP address or email)
 * @param limit Maximum number of allowed requests within the window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  // If the window has expired, reset the bucket
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: record.resetTime,
    };
  }

  // If the limit is reached, return failure
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment and allow request
  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

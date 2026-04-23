import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redis = null;

/**
 * Initialize Redis connection.
 * Falls back gracefully if Redis is unavailable (uses MongoDB-only atomic update).
 */
export function initRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('⚠️  REDIS_URL not set — seat locking will use MongoDB atomic fallback');
    return null;
  }

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying
      return Math.min(times * 200, 2000);
    },
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  });

  redis.on('connect', () => console.log('✅ Redis connected'));
  redis.on('error', (err) => console.error('⚠️  Redis error:', err.message));

  return redis;
}

export function getRedis() {
  return redis;
}

/**
 * Acquire a distributed lock for a specific showtime.
 * Uses SET NX EX pattern — simple and effective for single-instance Redis.
 * 
 * @param {string} showtimeId - The showtime being booked
 * @param {string} requestId - Unique identifier for this booking attempt
 * @param {number} ttlSeconds - Lock auto-expires after this many seconds (safety net)
 * @returns {boolean} true if lock acquired, false if someone else holds it
 */
export async function acquireLock(showtimeId, requestId, ttlSeconds = 10) {
  if (!redis) return true; // No Redis = no distributed lock (fallback to MongoDB atomic)

  const lockKey = `lock:showtime:${showtimeId}`;
  // SET key value NX EX ttl — only sets if key doesn't exist, expires in ttl seconds
  const result = await redis.set(lockKey, requestId, 'NX', 'EX', ttlSeconds);
  return result === 'OK';
}

/**
 * Release the distributed lock, but ONLY if we still own it.
 * Uses a Lua script for atomic check-and-delete.
 */
export async function releaseLock(showtimeId, requestId) {
  if (!redis) return;

  const lockKey = `lock:showtime:${showtimeId}`;
  // Lua script: only delete if the value matches our requestId (prevents releasing someone else's lock)
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(script, 1, lockKey, requestId);
}

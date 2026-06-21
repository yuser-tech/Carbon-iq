import { z } from 'zod';
import { serverEnv } from './env';

const GENERIC_ERROR = 'Unable to process request right now';
const MAX_TEXT_LENGTH = 2_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const textSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_TEXT_LENGTH)
  .refine((value) => value.replace(/[\u0000-\u001F\u007F]/g, '').trim().length > 0, {
    message: 'Text must include visible characters',
  });

export const chatMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant', 'system']),
    content: textSchema,
  })
  .strict();

export const chatPayloadSchema = z
  .object({
    message: textSchema,
    history: z.array(chatMessageSchema).max(20).default([]),
    recaptchaToken: z.string().trim().min(1).max(4096),
  })
  .strict();

export const suggestionUserDataSchema = z
  .object({
    score: z.number().finite().min(0).max(100),
    breakdown: z
      .object({
        transport: z.number().finite().min(0).max(100),
        energy: z.number().finite().min(0).max(100),
        diet: z.number().finite().min(0).max(100),
        shopping: z.number().finite().min(0).max(100),
      })
      .strict(),
  })
  .strict();

export const suggestionsPayloadSchema = z
  .object({
    userData: suggestionUserDataSchema,
    recaptchaToken: z.string().trim().min(1).max(4096),
  })
  .strict();

export function sanitizeText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function genericErrorResponse(status = 500) {
  return Response.json({ error: GENERIC_ERROR }, { status });
}

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(',').map((part) => part.trim()).filter(Boolean);
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

export function checkRateLimit(req: Request, route: string, now = Date.now()) {
  const key = `${route}:${getClientIp(req)}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true };
  }

  current.count += 1;
  return { limited: false };
}

export async function verifyRecaptcha(token: string, remoteIp: string) {
  const secret = serverEnv.RECAPTCHA_SECRET_KEY;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp !== 'unknown') params.set('remoteip', remoteIp);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) return false;

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

export function resetRateLimiterForTests() {
  if (process.env.NODE_ENV === 'test') {
    rateLimitStore.clear();
  }
}

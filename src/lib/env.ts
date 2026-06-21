import { z } from 'zod';

const requiredEnvValue = z.string().trim().min(1, 'Required environment variable cannot be empty');

export const serverEnvSchema = z
  .object({
    GEMINI_API_KEY: requiredEnvValue,
    RECAPTCHA_SECRET_KEY: requiredEnvValue,
  })
  .strict();

export const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: requiredEnvValue,
  })
  .strict();

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

type EnvSource = Record<string, string | undefined>;

export function getServerEnv(source: EnvSource = process.env): ServerEnv {
  return serverEnvSchema.parse({
    GEMINI_API_KEY: source.GEMINI_API_KEY,
    RECAPTCHA_SECRET_KEY: source.RECAPTCHA_SECRET_KEY,
  });
}

export function getClientEnv(source: EnvSource = process.env): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: source.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  });
}

export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, property: string | symbol) {
    if (typeof property !== 'string') return undefined;
    return getServerEnv()[property as keyof ServerEnv];
  },
});

export const clientEnv: ClientEnv = new Proxy({} as ClientEnv, {
  get(_target, property: string | symbol) {
    if (typeof property !== 'string') return undefined;
    return getClientEnv()[property as keyof ClientEnv];
  },
});

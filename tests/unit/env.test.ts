import { getClientEnv, getServerEnv } from '@/lib/env';

describe('environment validation', () => {
  const validEnv = {
    GEMINI_API_KEY: 'gemini-key',
    RECAPTCHA_SECRET_KEY: 'recaptcha-secret',
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'recaptcha-site-key',
  };

  it('rejects missing server environment variables', () => {
    expect(() => getServerEnv({ RECAPTCHA_SECRET_KEY: validEnv.RECAPTCHA_SECRET_KEY })).toThrow();
    expect(() => getServerEnv({ GEMINI_API_KEY: validEnv.GEMINI_API_KEY })).toThrow();
  });

  it('rejects malformed server environment variables', () => {
    expect(() => getServerEnv({ ...validEnv, GEMINI_API_KEY: '   ' })).toThrow();
    expect(() => getServerEnv({ ...validEnv, RECAPTCHA_SECRET_KEY: '' })).toThrow();
  });

  it('returns typed server environment variables for valid configuration', () => {
    expect(getServerEnv(validEnv)).toEqual({
      GEMINI_API_KEY: validEnv.GEMINI_API_KEY,
      RECAPTCHA_SECRET_KEY: validEnv.RECAPTCHA_SECRET_KEY,
    });
  });

  it('rejects missing public client environment variables', () => {
    expect(() => getClientEnv({})).toThrow();
  });

  it('rejects malformed public client environment variables', () => {
    expect(() => getClientEnv({ NEXT_PUBLIC_RECAPTCHA_SITE_KEY: '   ' })).toThrow();
  });

  it('returns typed client environment variables for valid configuration', () => {
    expect(getClientEnv(validEnv)).toEqual({
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: validEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    });
  });
});

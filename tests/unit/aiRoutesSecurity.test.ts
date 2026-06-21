/** @jest-environment node */

import { resetRateLimiterForTests } from '@/lib/apiSecurity';
import { POST as chatPost } from '@/app/api/chat/route';
import { POST as suggestionsPost } from '@/app/api/suggestions/route';
import { chatWithCoach, generateSustainabilityAdvice } from '@/lib/gemini';

jest.mock('@/lib/gemini', () => ({
  chatWithCoach: jest.fn(),
  generateSustainabilityAdvice: jest.fn(),
}));

const mockedChatWithCoach = jest.mocked(chatWithCoach);
const mockedGenerateAdvice = jest.mocked(generateSustainabilityAdvice);

function request(url: string, body: unknown, ip = '203.0.113.10') {
  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

function mockRecaptcha(success: boolean) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success }),
  }) as jest.Mock;
}

describe('AI route security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetRateLimiterForTests();
    process.env.GEMINI_API_KEY = 'gemini-test-key';
    process.env.RECAPTCHA_SECRET_KEY = 'server-only-secret';
    mockRecaptcha(true);
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.RECAPTCHA_SECRET_KEY;
  });

  it('rejects invalid chat payloads with a generic error', async () => {
    const response = await chatPost(request('https://example.com/api/chat', { message: '', history: [], recaptchaToken: 'token' }));

    await expect(response.json()).resolves.toEqual({ error: 'Unable to process request right now' });
    expect(response.status).toBe(400);
    expect(mockedChatWithCoach).not.toHaveBeenCalled();
  });

  it('rejects suggestion requests without a reCAPTCHA token', async () => {
    const response = await suggestionsPost(
      request('https://example.com/api/suggestions', {
        userData: { score: 5, breakdown: { transport: 1, energy: 1, diet: 1, shopping: 1 } },
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: 'Unable to process request right now' });
    expect(response.status).toBe(400);
    expect(mockedGenerateAdvice).not.toHaveBeenCalled();
  });

  it('rejects requests when Google reCAPTCHA verification fails', async () => {
    mockRecaptcha(false);

    const response = await chatPost(
      request('https://example.com/api/chat', { message: 'hello', history: [], recaptchaToken: 'bad-token' }),
    );

    await expect(response.json()).resolves.toEqual({ error: 'Unable to process request right now' });
    expect(response.status).toBe(403);
    expect(mockedChatWithCoach).not.toHaveBeenCalled();
  });

  it('rate-limits repeated requests by route and IP before calling verification', async () => {
    mockedChatWithCoach.mockResolvedValue('ok');

    for (let index = 0; index < 20; index += 1) {
      const response = await chatPost(
        request('https://example.com/api/chat', { message: `hello ${index}`, history: [], recaptchaToken: 'token' }, '198.51.100.7'),
      );
      expect(response.status).toBe(200);
    }

    const limitedResponse = await chatPost(
      request('https://example.com/api/chat', { message: 'one too many', history: [], recaptchaToken: 'token' }, '198.51.100.7'),
    );

    await expect(limitedResponse.json()).resolves.toEqual({ error: 'Unable to process request right now' });
    expect(limitedResponse.status).toBe(429);
    expect(mockedChatWithCoach).toHaveBeenCalledTimes(20);
    expect(global.fetch).toHaveBeenCalledTimes(20);
  });

  it('processes successful verified requests with sanitized chat text', async () => {
    mockedChatWithCoach.mockResolvedValue('sanitized response');

    const response = await chatPost(
      request('https://example.com/api/chat', {
        message: '  <hello>\nthere  ',
        history: [{ role: 'user', content: ' previous\u0000 message ' }],
        recaptchaToken: 'good-token',
      }),
    );

    await expect(response.json()).resolves.toEqual({ response: 'sanitized response' });
    expect(response.status).toBe(200);
    expect(mockedChatWithCoach).toHaveBeenCalledWith('hello there', [{ role: 'user', content: 'previous message' }]);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('processes successful verified suggestion requests', async () => {
    const advice = { advice: [], motivation: 'Keep going' };
    mockedGenerateAdvice.mockResolvedValue(advice);

    const userData = { score: 10, breakdown: { transport: 2, energy: 3, diet: 4, shopping: 1 } };
    const response = await suggestionsPost(
      request('https://example.com/api/suggestions', { userData, recaptchaToken: 'good-token' }, '198.51.100.8'),
    );

    await expect(response.json()).resolves.toEqual(advice);
    expect(response.status).toBe(200);
    expect(mockedGenerateAdvice).toHaveBeenCalledWith(userData);
  });
});

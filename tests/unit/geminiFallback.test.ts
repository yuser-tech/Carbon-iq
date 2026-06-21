import {
  createGeminiFallbackService,
  GEMINI_FALLBACK_MODELS,
  SAFE_GEMINI_FALLBACK_MESSAGE,
} from '@/lib/geminiFallback';

const textResponse = (text: string) => ({ response: { text: () => text } });

describe('Gemini fallback service', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('succeeds on the first model', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse('first-model response'));
    const modelFactory = jest.fn().mockReturnValue({ generateContent });
    const service = createGeminiFallbackService({ modelFactory, logger: { warn: jest.fn() } });

    await expect(service.generateContent('prompt text')).resolves.toBe('first-model response');

    expect(modelFactory).toHaveBeenCalledTimes(1);
    expect(modelFactory).toHaveBeenCalledWith(GEMINI_FALLBACK_MODELS[0]);
    expect(generateContent).toHaveBeenCalledWith('prompt text');
  });

  test('falls back to the next model on quota error', async () => {
    const quotaError = Object.assign(new Error('Quota exceeded'), { status: 429 });
    const firstGenerateContent = jest.fn().mockRejectedValue(quotaError);
    const secondGenerateContent = jest.fn().mockResolvedValue(textResponse('second-model response'));
    const logger = { warn: jest.fn() };
    const modelFactory = jest
      .fn()
      .mockReturnValueOnce({ generateContent: firstGenerateContent })
      .mockReturnValueOnce({ generateContent: secondGenerateContent });
    const service = createGeminiFallbackService({ modelFactory, logger });

    await expect(service.generateContent('prompt text')).resolves.toBe('second-model response');

    expect(modelFactory).toHaveBeenNthCalledWith(1, 'gemini-2.5-flash');
    expect(modelFactory).toHaveBeenNthCalledWith(2, 'gemini-3.5-flash');
    expect(logger.warn).toHaveBeenCalledWith('Gemini model request failed', {
      model: 'gemini-2.5-flash',
      reason: 'Error',
      status: 429,
      willRetry: true,
    });
  });

  test('falls back to the next model on timeout', async () => {
    jest.useFakeTimers();
    const neverResolves = jest.fn().mockReturnValue(new Promise(() => undefined));
    const secondGenerateContent = jest.fn().mockResolvedValue(textResponse('timeout fallback response'));
    const modelFactory = jest
      .fn()
      .mockReturnValueOnce({ generateContent: neverResolves })
      .mockReturnValueOnce({ generateContent: secondGenerateContent });
    const service = createGeminiFallbackService({
      modelFactory,
      timeoutMs: 25,
      logger: { warn: jest.fn() },
    });

    const result = service.generateContent('prompt text');
    await jest.advanceTimersByTimeAsync(25);

    await expect(result).resolves.toBe('timeout fallback response');
    expect(modelFactory).toHaveBeenNthCalledWith(2, 'gemini-3.5-flash');
  });

  test('returns a safe fallback when all models fail', async () => {
    const overloadError = Object.assign(new Error('service overloaded'), { status: 503 });
    const logger = { warn: jest.fn() };
    const modelFactory = jest.fn().mockReturnValue({
      generateContent: jest.fn().mockRejectedValue(overloadError),
    });
    const service = createGeminiFallbackService({ modelFactory, logger });

    await expect(service.generateContent('prompt text')).resolves.toBe(SAFE_GEMINI_FALLBACK_MESSAGE);

    expect(modelFactory).toHaveBeenCalledTimes(4);
    expect(modelFactory.mock.calls.map(([model]) => model)).toEqual([...GEMINI_FALLBACK_MODELS]);
    expect(logger.warn).toHaveBeenCalledTimes(4);
    expect(JSON.stringify(logger.warn.mock.calls)).not.toContain('prompt text');
  });
});

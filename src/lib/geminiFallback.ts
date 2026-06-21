import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverEnv } from "./env";

export const GEMINI_FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
] as const;

export const DEFAULT_GEMINI_TIMEOUT_MS = 15_000;
export const SAFE_GEMINI_FALLBACK_MESSAGE =
  "I'm having trouble reaching the AI coach right now. Please try again later, or start with one small sustainability action today.";

type GeminiModelName = (typeof GEMINI_FALLBACK_MODELS)[number];
type GeminiModel = {
  generateContent?: (prompt: string) => Promise<{ response: { text: () => string } }>;
  startChat?: (options: { history: Array<{ role: string; parts: Array<{ text: string }> }> }) => {
    sendMessage: (message: string) => Promise<{ response: { text: () => string } }>;
  };
};
type ModelFactory = (modelName: GeminiModelName) => GeminiModel;

type GeminiFallbackOptions = {
  modelFactory?: ModelFactory;
  timeoutMs?: number;
  logger?: Pick<Console, "warn">;
};

const defaultModelFactory: ModelFactory = (modelName) => {
  const genAI = new GoogleGenerativeAI(serverEnv.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: modelName });
};

const timeoutError = (modelName: string, timeoutMs: number) => {
  const error = new Error(`Gemini model ${modelName} timed out after ${timeoutMs}ms`);
  error.name = "AbortError";
  return error;
};

const withTimeout = async <T>(
  operation: Promise<T>,
  modelName: GeminiModelName,
  timeoutMs: number,
): Promise<T> => {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(timeoutError(modelName, timeoutMs));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) return undefined;
  const candidate = error as { status?: unknown; statusCode?: unknown; code?: unknown };
  const status = candidate.status ?? candidate.statusCode ?? candidate.code;
  if (typeof status === "number") return status;
  if (typeof status === "string") {
    const parsed = Number.parseInt(status, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const shouldFallbackGeminiError = (error: unknown) => {
  const status = getErrorStatus(error);
  if (status && [408, 429, 500, 502, 503, 504].includes(status)) return true;

  if (error instanceof Error && error.name === "AbortError") return true;

  const message = error instanceof Error ? error.message : String(error);
  return /quota|rate.?limit|unavailable|overload|busy|timeout|timed? out|temporarily|resource exhausted/i.test(message);
};

const logSafeGeminiFailure = (
  logger: Pick<Console, "warn">,
  modelName: GeminiModelName,
  error: unknown,
  willRetry: boolean,
) => {
  const status = getErrorStatus(error);
  const reason = error instanceof Error ? error.name : typeof error;
  logger.warn("Gemini model request failed", {
    model: modelName,
    reason,
    status,
    willRetry,
  });
};

export const createGeminiFallbackService = (options: GeminiFallbackOptions = {}) => {
  const modelFactory = options.modelFactory ?? defaultModelFactory;
  const timeoutMs = options.timeoutMs ?? DEFAULT_GEMINI_TIMEOUT_MS;
  const logger = options.logger ?? console;

  const runWithFallback = async (operation: (model: GeminiModel) => Promise<string>) => {
    for (const modelName of GEMINI_FALLBACK_MODELS) {
      try {
        return await withTimeout(operation(modelFactory(modelName)), modelName, timeoutMs);
      } catch (error) {
        const canFallback = shouldFallbackGeminiError(error);
        const willRetry = canFallback && modelName !== GEMINI_FALLBACK_MODELS[GEMINI_FALLBACK_MODELS.length - 1];
        logSafeGeminiFailure(logger, modelName, error, willRetry);
        if (!canFallback) break;
      }
    }

    return SAFE_GEMINI_FALLBACK_MESSAGE;
  };

  return {
    generateContent: (prompt: string) =>
      runWithFallback(async (model) => {
        if (!model.generateContent) throw new Error("Gemini generateContent unavailable");
        const result = await model.generateContent(prompt);
        return result.response.text();
      }),
    sendChatMessage: (message: string, history: Array<{ role: string; content: string }>) =>
      runWithFallback(async (model) => {
        if (!model.startChat) throw new Error("Gemini chat unavailable");
        const chat = model.startChat({
          history: history.map((h) => ({ role: h.role, parts: [{ text: h.content }] })),
        });
        const result = await chat.sendMessage(message);
        return result.response.text();
      }),
  };
};

export const geminiFallback = createGeminiFallbackService();

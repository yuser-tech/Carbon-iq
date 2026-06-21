import { generateSustainabilityAdvice } from '@/lib/gemini';
import {
  checkRateLimit,
  genericErrorResponse,
  getClientIp,
  suggestionsPayloadSchema,
  verifyRecaptcha,
} from '@/lib/apiSecurity';

export async function POST(req: Request) {
  try {
    if (checkRateLimit(req, '/api/suggestions').limited) {
      return genericErrorResponse(429);
    }

    const payload = suggestionsPayloadSchema.safeParse(await req.json());
    if (!payload.success) {
      return genericErrorResponse(400);
    }

    const verified = await verifyRecaptcha(payload.data.recaptchaToken, getClientIp(req));
    if (!verified) {
      return genericErrorResponse(403);
    }

    const suggestions = await generateSustainabilityAdvice(payload.data.userData);
    return Response.json(suggestions);
  } catch {
    return genericErrorResponse();
  }
}

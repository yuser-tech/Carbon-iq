import { chatWithCoach } from '@/lib/gemini';
import {
  chatPayloadSchema,
  checkRateLimit,
  genericErrorResponse,
  getClientIp,
  sanitizeText,
  verifyRecaptcha,
} from '@/lib/apiSecurity';

export async function POST(req: Request) {
  try {
    if (checkRateLimit(req, '/api/chat').limited) {
      return genericErrorResponse(429);
    }

    const payload = chatPayloadSchema.safeParse(await req.json());
    if (!payload.success) {
      return genericErrorResponse(400);
    }

    const verified = await verifyRecaptcha(payload.data.recaptchaToken, getClientIp(req));
    if (!verified) {
      return genericErrorResponse(403);
    }

    const response = await chatWithCoach(
      sanitizeText(payload.data.message),
      payload.data.history.map((message) => ({
        role: message.role,
        content: sanitizeText(message.content),
      })),
    );

    return Response.json({ response });
  } catch {
    return genericErrorResponse();
  }
}

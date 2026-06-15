import { NextResponse } from 'next/server';
import { chatWithCoach } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const response = await chatWithCoach(message, history);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to chat with coach' }, { status: 500 });
  }
}

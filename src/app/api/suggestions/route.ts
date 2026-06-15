import { NextResponse } from 'next/server';
import { generateSustainabilityAdvice } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userData } = await req.json();
    const suggestions = await generateSustainabilityAdvice(userData);
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}

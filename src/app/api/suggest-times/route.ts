
import { suggestOptimalTaskTimes } from '@/ai/flows/suggest-optimal-task-times';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await suggestOptimalTaskTimes(input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in suggest-times API route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

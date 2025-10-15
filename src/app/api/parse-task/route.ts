
import { parseTaskFromText } from '@/ai/flows/parse-task-from-text';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json();
    if (!command) {
        return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }
    const result = await parseTaskFromText(command);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in parse-task API route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

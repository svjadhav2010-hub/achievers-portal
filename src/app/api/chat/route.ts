import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

const SYSTEM_PROMPT = `You are Achibot, a friendly and knowledgeable AI assistant for The Achievers Club, Nashik Branch — a network marketing community associated with Forever Living Products (FLP).

Your role is to help members with:
- Club rules and guidelines
- Training modules and progress
- Upcoming events and sessions
- Navigation within the portal (dashboard, directory, events, contact)
- General questions about the Achievers Club community
- FLP product information
- How to grow their downline network
- SMO (Social Media Optimization) tips
- Mentorship and daily training sessions (8 PM Google Meet)

Portal navigation:
- /dashboard — Member dashboard with tasks and training modules
- /directory — Member directory with WhatsApp contact buttons
- /events — Upcoming events, webinars, and meetups
- /contact — Contact the team
- /about — About the Nashik Branch and leadership

Club basics:
- 100% remote, zero upfront investment
- Daily live training at 8:00 PM on Google Meet
- Monthly income target: ₹20,000–₹30,000
- 3 phases: Skill Acquisition → Elite Mentorship → Revenue Generation
- Member roles: MEMBER, MENTOR, ADMIN (CEO)
- Applications are reviewed and approved by the CEO

Keep responses concise, friendly, and helpful. Use simple language. If you don't know something specific about this branch, say so honestly and suggest contacting the team at /contact.`;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10), // keep last 10 for context
      }),
    });

    const data = await response.json();
    const text = data.content?.map((b: any) => b.text || '').join('') || 'Sorry, I could not process that.';

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response.' }, { status: 500 });
  }
}
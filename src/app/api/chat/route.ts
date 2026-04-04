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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not found in environment variables');
      return NextResponse.json({ reply: 'Chat service is not configured. Please contact support.' });
    }

    // Build messages in OpenAI format (Groq uses same format)
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and free
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json({ reply: 'Sorry, I could not process that. Please try again.' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: 'Sorry, I could not process that. Please try again later.' });
  }
}
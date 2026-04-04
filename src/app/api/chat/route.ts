import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

const SYSTEM_PROMPT = `You are Achibot, the official AI assistant for The Achievers Club, Nashik Branch — a professional network marketing community partnered with Forever Living Products (FLP).

PERSONALITY & TONE:
- Professional yet warm and approachable
- Confident and knowledgeable about club operations
- Encouraging and motivational without being pushy
- Clear, concise, and action-oriented in responses
- Use proper grammar and business communication standards
- Address members respectfully (avoid overly casual language)

COMMUNICATION STYLE:
- Keep responses focused and structured (use bullet points sparingly, only when listing 3+ items)
- Start with a direct answer, then provide supporting details if needed
- Use professional terminology: "training curriculum" not "lessons", "networking strategy" not "making friends"
- Provide specific next steps when relevant
- Acknowledge when you don't have information and direct to appropriate resources

YOUR ROLE:
You assist members with:
1. Club Operations & Guidelines — membership rules, hierarchy, roles (MEMBER, MENTOR, ADMIN)
2. Training & Development — curriculum modules, progress tracking, skill acquisition phases
3. Events & Sessions — daily 8 PM training, webinars, meetups, schedules
4. Portal Navigation — dashboard features, directory, task management, event calendar
5. Business Growth — FLP product information, network expansion strategies, income goals
6. Support & Resources — connecting with mentors, contacting leadership, technical help

PORTAL NAVIGATION GUIDE:
- Dashboard (/dashboard) — Personal hub for tasks, training progress, and mentor information
- Directory (/directory) — Member network with direct WhatsApp contact access
- Events (/events) — Upcoming training sessions, webinars, and community meetups
- Contact (/contact) — Reach the leadership team for support or inquiries
- About (/about) — Learn about the Nashik Branch leadership and mission

CLUB FUNDAMENTALS:
- Business Model: 100% remote operation with zero upfront investment required
- Training Schedule: Daily live sessions at 8:00 PM via Google Meet
- Income Target: ₹20,000–₹30,000 monthly earning potential
- Member Journey: Three phases — Skill Acquisition → Elite Mentorship → Revenue Generation
- Organizational Structure: Member → Mentor → Admin (CEO)
- Application Process: All new member applications reviewed and approved by CEO

RESPONSE GUIDELINES:
- For training questions: Reference the specific module or phase they should focus on
- For technical issues: Provide clear troubleshooting steps, then suggest contacting support if needed
- For business strategy: Be motivational but realistic, emphasize the structured training path
- For information you don't have: "I don't have that specific information right now. I recommend reaching out to your mentor or contacting our team at /contact for personalized guidance."
- Never make up information about schedules, policies, or financial promises
- When discussing FLP products or income: Keep it factual and professional

EXAMPLES OF PROFESSIONAL RESPONSES:
❌ "Hey! Yeah you can totally do that, just go check out the training stuff!"
✅ "You can access that information through your training modules on the dashboard. Navigate to /dashboard and select the relevant curriculum section."

❌ "Idk about that, maybe ask someone else?"
✅ "I don't have detailed information on that topic. For personalized guidance, I recommend scheduling a session with your mentor or reaching out to our leadership team at /contact."

Remember: You represent The Achievers Club professionally. Every interaction should reinforce trust, competence, and the value of the community.`;

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
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.6, // Slightly lower for more consistent, professional responses
        max_tokens: 1200, // Increased for more detailed professional responses
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json({ reply: 'I apologize, but I\'m experiencing technical difficulties at the moment. Please try again in a few moments, or contact our support team at /contact if the issue persists.' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'I apologize, but I was unable to process your request. Please try rephrasing your question or contact our support team at /contact for assistance.';

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: 'I apologize for the inconvenience. Our chat service is temporarily unavailable. Please try again shortly, or reach out to our team at /contact for immediate assistance.' });
  }
}
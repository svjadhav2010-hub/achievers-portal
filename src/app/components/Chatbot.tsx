'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m Achibot 👋 Your Achievers Club assistant. Ask me anything about the club, your training, events, or how to navigate the portal!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const QUICK = ['What are the training modules?', 'When is the daily session?', 'How do I grow my network?', 'How to contact support?'];

  return (
    <>
      <style>{`
        .chat-bubble-user { background: #0d0d0d; color: white; border-radius: 18px 18px 4px 18px; }
        .chat-bubble-bot { background: white; border: 1px solid rgba(0,0,0,0.08); color: #0d0d0d; border-radius: 18px 18px 18px 4px; }
        .chat-window { position: fixed; bottom: 96px; right: 24px; width: 360px; height: 520px; background: var(--paper, #f8f7f4); border: 1px solid rgba(0,0,0,0.08); border-radius: 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; z-index: 1000; overflow: hidden; font-family: var(--font-sans, system-ui); }
        .chat-btn { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #00aac8, #8dc63f); border: none; cursor: pointer; z-index: 1001; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,170,200,0.4); transition: transform 0.2s; }
        .chat-btn:hover { transform: scale(1.08); }
        @media (max-width: 480px) { .chat-window { width: calc(100vw - 32px); right: 16px; } }
      `}</style>

      {/* Chat window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div style={{ background: '#0d0d0d', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00aac8, #8dc63f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Achibot</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Achievers Club Assistant · Always online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 18, lineHeight: 1, padding: 4 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                  style={{ padding: '10px 14px', fontSize: 13, lineHeight: 1.6, maxWidth: '85%', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div className="chat-bubble-bot" style={{ padding: '10px 16px', fontSize: 13 }}>
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#aaa', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 0); }}
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 500, color: '#5a5a5a', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00aac8'; e.currentTarget.style.color = '#00aac8'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#5a5a5a'; }}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8, flexShrink: 0, background: 'white' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0d0d0d', background: '#f8f7f4' }}
            />
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ width: 40, height: 40, borderRadius: 12, background: input.trim() ? '#0d0d0d' : '#f0f0f0', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? 'white' : '#bbb'} strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button className="chat-btn" onClick={() => setOpen(o => !o)} aria-label="Open chat assistant">
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
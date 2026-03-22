'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type FilterType = 'all' | 'upcoming' | 'past';

const EVENTS = [
  {
    id: 1,
    status: 'upcoming',
    type: 'Live Training',
    typeColor: 'var(--teal)',
    typeBg: 'var(--teal-light)',
    title: 'SMO Mastery Workshop',
    desc: 'A deep-dive into Social Media Optimization strategies that convert — from profile building to lead generation. Hosted by senior mentors.',
    date: 'April 5, 2025',
    time: '8:00 PM – 10:00 PM',
    location: 'Google Meet (Online)',
    seats: '38 seats left',
    host: 'Swayam Jadhav',
    hostInitials: 'SJ',
    accentColor: 'var(--teal)',
  },
  {
    id: 2,
    status: 'upcoming',
    type: 'Networking',
    typeColor: 'var(--orange)',
    typeBg: 'var(--orange-light)',
    title: 'Nashik Achievers Meetup — Q2',
    desc: 'Our quarterly in-person meetup. Connect with 100+ achievers, celebrate top performers of Q1, and get a sneak peek at the Q2 growth plan.',
    date: 'April 19, 2025',
    time: '5:00 PM – 9:00 PM',
    location: 'Hotel Sai Palace, Nashik',
    seats: '12 seats left',
    host: 'Riya Deshmukh',
    hostInitials: 'RD',
    accentColor: 'var(--orange)',
  },
  {
    id: 3,
    status: 'upcoming',
    type: 'Webinar',
    typeColor: '#8dc63f',
    typeBg: '#f2f9e6',
    title: 'Financial Freedom Blueprint',
    desc: 'How to build multiple income streams with zero upfront investment. A session tailored for newcomers and those exploring the digital entrepreneurship path.',
    date: 'May 3, 2025',
    time: '7:30 PM – 9:00 PM',
    location: 'Zoom (Online)',
    seats: 'Open registration',
    host: 'Aarav Kulkarni',
    hostInitials: 'AK',
    accentColor: '#8dc63f',
  },
  {
    id: 4,
    status: 'past',
    type: 'Live Training',
    typeColor: 'var(--teal)',
    typeBg: 'var(--teal-light)',
    title: 'Digital Networking Basics',
    desc: 'Foundations of building a professional digital network — LinkedIn, WhatsApp groups, and referral pipelines. Over 200 attendees joined live.',
    date: 'March 8, 2025',
    time: '8:00 PM – 9:30 PM',
    location: 'Google Meet (Online)',
    seats: '214 attended',
    host: 'Swayam Jadhav',
    hostInitials: 'SJ',
    accentColor: 'var(--teal)',
  },
  {
    id: 5,
    status: 'past',
    type: 'Networking',
    typeColor: 'var(--orange)',
    typeBg: 'var(--orange-light)',
    title: 'Nashik Achievers Meetup — Q1',
    desc: 'Our biggest in-person event of the year. Top performers were felicitated, new managers were announced, and the Q2 vision was revealed.',
    date: 'January 25, 2025',
    time: '5:00 PM – 9:00 PM',
    location: 'Radisson Blu, Nashik',
    seats: '180 attended',
    host: 'Riya Deshmukh',
    hostInitials: 'RD',
    accentColor: 'var(--orange)',
  },
  {
    id: 6,
    status: 'past',
    type: 'Webinar',
    typeColor: '#8dc63f',
    typeBg: '#f2f9e6',
    title: 'New Year Kickoff — 2025 Goals',
    desc: 'Setting the tone for 2025. Members shared their income targets, mentors shared their growth playbooks, and we kicked off the year together.',
    date: 'January 4, 2025',
    time: '9:00 PM – 10:30 PM',
    location: 'Zoom (Online)',
    seats: '312 attended',
    host: 'Aarav Kulkarni',
    hostInitials: 'AK',
    accentColor: '#8dc63f',
  },
];

export default function EventsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.status === filter);
  const upcomingCount = EVENTS.filter(e => e.status === 'upcoming').length;
  const pastCount = EVENTS.filter(e => e.status === 'past').length;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#0d0d0d] overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        :root {
          --teal: #00aac8; --teal-light: #e0f6fb;
          --orange: #f5821f; --orange-light: #fef3e8;
          --lime: #8dc63f; --ink: #0d0d0d; --ink-muted: #5a5a5a;
          --paper: #f8f7f4; --paper-warm: #f2f0ec;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: var(--font-serif); }

        .nav-pill { background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); border: 1px solid rgba(0,0,0,0.07); border-radius: 100px; }

        .mobile-drawer { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(13,13,13,0.97); z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 36px; padding: 40px 24px; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .mobile-drawer.open { transform: translateX(0); }
        .mobile-nav-link { font-family: var(--font-serif); font-size: 36px; color: white; text-decoration: none; letter-spacing: -0.02em; opacity: 0.85; transition: opacity 0.2s; }
        .mobile-nav-link:hover { opacity: 1; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; z-index: 300; }
        .hamburger span { display: block; width: 22px; height: 2px; background: #0d0d0d; border-radius: 2px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); transform-origin: center; }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: white; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: white; }
        @media (max-width: 768px) { .desktop-nav-links { display: none !important; } .desktop-nav-actions { display: none !important; } .hamburger { display: flex !important; } }

        .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--teal-light); color: var(--teal); border: 1px solid rgba(0,170,200,0.2); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .badge-orange { background: var(--orange-light); color: var(--orange); border-color: rgba(245,130,31,0.2); }

        .btn-primary { background: var(--orange); color: white; border: none; border-radius: 100px; padding: 16px 36px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); display: inline-flex; align-items: center; gap: 8px; text-decoration: none; letter-spacing: -0.01em; }
        .btn-primary:hover { background: #e07018; transform: scale(1.04); box-shadow: 0 12px 32px rgba(245,130,31,0.35); }
        .btn-ghost { background: transparent; color: var(--ink); border: 1px solid rgba(0,0,0,0.15); border-radius: 100px; padding: 14px 28px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        .section-divider { width: 48px; height: 3px; background: linear-gradient(90deg, var(--teal), var(--lime)); border-radius: 2px; margin-bottom: 24px; }
        .hr-gradient { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent); }

        /* Filter tabs */
        .filter-tab { padding: 8px 22px; border-radius: 100px; border: 1px solid rgba(0,0,0,0.12); background: transparent; font-size: 14px; font-weight: 500; color: #5a5a5a; cursor: pointer; transition: all 0.2s; }
        .filter-tab:hover { border-color: var(--teal); color: var(--teal); }
        .filter-tab.active { background: #0d0d0d; color: white; border-color: #0d0d0d; }

        /* Event card */
        .event-card { background: white; border: 1px solid rgba(0,0,0,0.06); border-radius: 24px; overflow: hidden; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease; display: flex; flex-direction: column; }
        .event-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.1); }
        .event-card.past { opacity: 0.72; }
        .event-card.past:hover { opacity: 1; }

        /* Meta row */
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #7a7a7a; font-weight: 400; }

        /* Host avatar */
        .host-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; flex-shrink: 0; }

        /* Featured upcoming card */
        .featured-card { background: #0d0d0d; border-radius: 28px; padding: 52px; display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center; position: relative; overflow: hidden; margin-bottom: 48px; }
        .featured-glow { position: absolute; top: -60px; right: -60px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(0,170,200,0.18) 0%, transparent 70%); pointer-events: none; }

        /* Countdown blocks */
        .countdown-block { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px 20px; text-align: center; min-width: 72px; }
        .countdown-num { font-family: var(--font-serif); font-size: 36px; color: white; line-height: 1; letter-spacing: -0.03em; }
        .countdown-label { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

        /* WhatsApp FAB */
        .wa-fab-wrapper { position: fixed; bottom: 28px; right: 28px; display: flex; align-items: center; gap: 10px; z-index: 150; }
        .wa-fab { width: 58px; height: 58px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(37,211,102,0.45); cursor: pointer; text-decoration: none; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s; }
        .wa-fab:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(37,211,102,0.55); }
        .wa-fab-label { background: white; color: #0d0d0d; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); white-space: nowrap; opacity: 0; transform: translateX(8px); transition: all 0.25s; pointer-events: none; }
        .wa-fab-wrapper:hover .wa-fab-label { opacity: 1; transform: translateX(0); }

        @media (max-width: 768px) {
          .featured-card { grid-template-columns: 1fr !important; gap: 32px !important; padding: 36px 28px !important; }
          .events-grid { grid-template-columns: 1fr !important; }
          .countdown-row { justify-content: flex-start !important; }
        }
      `}</style>

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {([['/', 'Home'], ['/#services', 'Services'], ['/#benefits', 'Why Join'], ['/about', 'About'], ['/events', 'Events'], ['/#contact', 'Contact']] as [string,string][]).map(([href, label]) => (
          <a key={href} href={href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, marginTop: 16 }}>
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center', padding: '14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Login</Link>
          <Link href="/register" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center', justifyContent: 'center' }}>Join Now ↗</Link>
        </div>
      </div>

      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, padding: '16px 24px' }}>
        <div className="nav-pill" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/icon.png" alt="Achievers Club" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 500, color: '#5a5a5a' }}>
            <Link href="/#services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
            <Link href="/#benefits" style={{ textDecoration: 'none', color: 'inherit' }}>Why Join</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
            <Link href="/events" style={{ textDecoration: 'none', color: 'var(--teal)', fontWeight: 600 }}>Events</Link>
            <Link href="/#contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
          </div>
          <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#5a5a5a', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>Join Now <span>↗</span></Link>
          </div>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ zIndex: 300 }}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="section-divider" />
          <div className="badge badge-orange" style={{ marginBottom: 20 }}>Events & Sessions</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
            <h1 className="serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Where achievers<br />
              <em style={{ color: 'var(--teal)' }}>show up.</em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#5a5a5a', fontWeight: 300, maxWidth: 380 }}>
              Live training sessions, in-person meetups, and webinars — built around one goal: your growth.
            </p>
          </div>

          {/* ─── FEATURED UPCOMING EVENT ─── */}
          <div className="featured-card">
            <div className="featured-glow" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,170,200,0.12)', border: '1px solid rgba(0,170,200,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next up</span>
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 14 }}>
                SMO Mastery Workshop
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, fontWeight: 300, maxWidth: 480, marginBottom: 28 }}>
                A deep-dive into Social Media Optimization strategies that convert. Hosted by Swayam Jadhav — April 5, 8 PM on Google Meet.
              </p>
              <Link href="/register" className="btn-primary">Reserve your spot →</Link>
            </div>

            {/* Countdown */}
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center' }}>Starts in</p>
              <div className="countdown-row" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {[['14', 'Days'], ['06', 'Hours'], ['30', 'Mins']].map(([num, lbl]) => (
                  <div key={lbl} className="countdown-block">
                    <div className="countdown-num">{num}</div>
                    <div className="countdown-label">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── FILTER TABS ─── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
            {([['all', `All (${EVENTS.length})`], ['upcoming', `Upcoming (${upcomingCount})`], ['past', `Past (${pastCount})`]] as [FilterType, string][]).map(([val, label]) => (
              <button key={val} className={`filter-tab ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          {/* ─── EVENTS GRID ─── */}
          <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {filtered.map(event => (
              <div key={event.id} className={`event-card ${event.status === 'past' ? 'past' : ''}`}>

                {/* Top accent */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${event.accentColor}, transparent)` }} />

                <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Type badge + status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: event.typeBg, color: event.typeColor, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {event.type}
                    </div>
                    {event.status === 'past' && (
                      <span style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed</span>
                    )}
                    {event.status === 'upcoming' && (
                      <span style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>● Upcoming</span>
                    )}
                  </div>

                  {/* Title & desc */}
                  <div>
                    <h3 className="serif" style={{ fontSize: 22, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.2 }}>{event.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6a6a6a', fontWeight: 300 }}>{event.desc}</p>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {event.date}
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {event.time}
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {event.location}
                    </div>
                  </div>

                  {/* Host + seats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="host-avatar" style={{ background: event.accentColor + 'cc' }}>{event.hostInitials}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#3a3a3a' }}>{event.host}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>Host</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: event.status === 'upcoming' ? 'var(--orange)' : '#aaa' }}>{event.seats}</div>
                  </div>
                </div>

                {/* CTA */}
                {event.status === 'upcoming' && (
                  <div style={{ padding: '0 28px 28px' }}>
                    <Link href="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
                      Register now →
                    </Link>
                  </div>
                )}
                {event.status === 'past' && (
                  <div style={{ padding: '0 28px 28px' }}>
                    <div style={{ width: '100%', textAlign: 'center', padding: '12px', fontSize: 14, color: '#bbb', fontWeight: 500 }}>Event ended</div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa', fontSize: 16 }}>No events to show.</div>
          )}
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── STAY UPDATED ─── */}
      <section style={{ padding: '80px 0', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: '#0d0d0d', borderRadius: 36, padding: '80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg, transparent, var(--teal), var(--lime), transparent)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 250, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,170,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge" style={{ marginBottom: 20, background: 'rgba(0,170,200,0.1)', borderColor: 'rgba(0,170,200,0.2)', color: 'var(--teal)' }}>Never miss an event</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
                Join the community<br />to get notified.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 36px', fontWeight: 300 }}>
                Members get early access to event registrations, exclusive invites, and reminders via WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>Join the community →</Link>
                <a href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20please%20add%20me%20to%20the%20events%20list!" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
                  WhatsApp updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0d0d0d', padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <img src="/icon.png" alt="" style={{ height: 28, width: 'auto', opacity: 0.9 }} />
              <span className="serif" style={{ color: 'white', fontSize: 18, letterSpacing: '-0.01em' }}>The Achievers Club</span>
            </div>
            <p style={{ color: '#4a4a4a', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Start Young · Retire Young</p>
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500, color: '#4a4a4a' }}>
            <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
            <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</Link>
            <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Support</Link>
          </div>
          <div style={{ fontSize: 13, color: '#3a3a3a' }}>© {new Date().getFullYear()} The Achievers Club · Nashik</div>
        </div>
      </footer>

      {/* ─── WHATSAPP FAB ─── */}
      <div className="wa-fab-wrapper">
        <div className="wa-fab-label">Chat with us on WhatsApp</div>
        <a href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20the%20Achievers%20Club%20events!" target="_blank" rel="noopener noreferrer" className="wa-fab" aria-label="Chat on WhatsApp">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="white"/>
            <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="#25D366"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
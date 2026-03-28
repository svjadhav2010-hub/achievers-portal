'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#0d0d0d] overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        :root {
          --teal: #00aac8;
          --teal-light: #e0f6fb;
          --orange: #f5821f;
          --orange-light: #fef3e8;
          --lime: #8dc63f;
          --ink: #0d0d0d;
          --ink-muted: #5a5a5a;
          --paper: #f8f7f4;
          --paper-warm: #f2f0ec;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: var(--font-serif); }

        .nav-pill {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
        }

        .mobile-drawer {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(13,13,13,0.97);
          z-index: 200;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 36px;
          padding: 40px 24px;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-drawer.open { transform: translateX(0); }
        .mobile-nav-link {
          font-family: var(--font-serif);
          font-size: 36px;
          color: white;
          text-decoration: none;
          letter-spacing: -0.02em;
          opacity: 0.85;
          transition: opacity 0.2s;
        }
        .mobile-nav-link:hover { opacity: 1; }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
          z-index: 300;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #0d0d0d;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: white; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: white; }

        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .desktop-nav-actions { display: none !important; }
          .hamburger { display: flex !important; }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--teal-light);
          color: var(--teal);
          border: 1px solid rgba(0,170,200,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .badge-orange {
          background: var(--orange-light);
          color: var(--orange);
          border-color: rgba(245,130,31,0.2);
        }

        .btn-primary {
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 16px 36px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover {
          background: #e07018;
          transform: scale(1.04);
          box-shadow: 0 12px 32px rgba(245,130,31,0.35);
        }
        .btn-ghost {
          background: transparent;
          color: var(--ink);
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 100px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        .section-divider {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal), var(--lime));
          border-radius: 2px;
          margin-bottom: 24px;
        }
        .hr-gradient {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent);
        }
        .card-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .card-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 64px -16px rgba(0,0,0,0.12);
        }

        /* Leader card */
        .leader-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 28px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .leader-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 64px -16px rgba(0,0,0,0.12);
        }
        .leader-avatar {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          background: linear-gradient(135deg, var(--teal-light), #d4f0f9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-initials {
          font-family: var(--font-serif);
          font-size: 56px;
          color: var(--teal);
          opacity: 0.5;
        }

        /* Value pill */
        .value-pill {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px 28px;
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
        }
        .value-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        /* Timeline */
        .timeline-item {
          display: flex;
          gap: 24px;
          position: relative;
        }
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--teal);
          flex-shrink: 0;
          margin-top: 6px;
          position: relative;
          z-index: 1;
        }
        .timeline-line {
          position: absolute;
          left: 5px;
          top: 18px;
          bottom: -32px;
          width: 2px;
          background: linear-gradient(to bottom, var(--teal), transparent);
        }

        /* Stats strip */
        .stat-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(0,0,0,0.06);
          border-radius: 20px;
          overflow: hidden;
        }
        .stat-strip-item {
          background: white;
          padding: 32px 24px;
          text-align: center;
        }

        @media (max-width: 768px) {
          section { padding: 72px 0 !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .stat-strip { grid-template-columns: 1fr 1fr !important; }
          .leaders-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .cta-inner { padding: 60px 28px !important; border-radius: 24px !important; }
          .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .story-grid > div:first-child { position: static !important; }
          .values-section-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }

        /* WhatsApp FAB */
        .wa-fab-wrapper {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 150;
        }
        .wa-fab {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(37,211,102,0.45);
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
        }
        .wa-fab:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(37,211,102,0.55); }
        .wa-fab-label {
          background: white;
          color: #0d0d0d;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 100px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          white-space: nowrap;
          opacity: 0;
          transform: translateX(8px);
          transition: all 0.25s;
          pointer-events: none;
        }
        .wa-fab-wrapper:hover .wa-fab-label { opacity: 1; transform: translateX(0); }
      `}</style>

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {([['/', 'Home'], ['/#services', 'Services'], ['/#benefits', 'Why Join'], ['/about', 'About'], ['/#contact', 'Contact']] as [string, string][]).map(([href, label]) => (
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
            <Link href="/#community" style={{ textDecoration: 'none', color: 'inherit' }}>Stories</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'var(--teal)', fontWeight: 600 }}>About</Link>
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
      <section style={{ paddingTop: 140, paddingBottom: 100, background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div className="badge" style={{ marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                Nashik Branch · Est. 2021
              </div>
              <h1 className="serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
                Built on hustle.<br />
                <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Driven by people.</em>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5a5a5a', fontWeight: 300, maxWidth: 460, marginBottom: 40 }}>
                The Achievers Club Nashik Branch is a tight-knit community of digital entrepreneurs who believe financial freedom isn't a privilege — it's a skill set.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-primary">Join the community →</Link>
                <Link href="/#community" className="btn-ghost">See member stories</Link>
              </div>
            </div>

            {/* Right: stat strip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stat-strip">
                {[
                  { val: '500+', label: 'Active members', sub: 'Nashik branch' },
                  { val: '2021', label: 'Founded', sub: 'Nashik, Maharashtra' },
                  { val: '₹30k', label: 'Avg. monthly target', sub: 'Per member' },
                ].map((s, i) => (
                  <div key={i} className="stat-strip-item">
                    <div className="serif" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 6 }}>{s.val}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Mission card */}
              <div style={{ background: '#0d0d0d', borderRadius: 24, padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,200,0.18) 0%, transparent 70%)' }} />
                <div className="badge" style={{ marginBottom: 16, background: 'rgba(0,170,200,0.1)', borderColor: 'rgba(0,170,200,0.2)', color: 'var(--teal)' }}>Our mission</div>
                <p className="serif" style={{ fontSize: 22, lineHeight: 1.4, color: 'white', letterSpacing: '-0.01em' }}>
                  "To empower every young professional in Nashik with the skills, mentorship, and network to achieve financial independence."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── OUR STORY ─── */}
      <section style={{ padding: '100px 0', background: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>

            {/* Left sticky */}
            <div style={{ position: 'sticky', top: 140 }}>
              <div className="section-divider" />
              <div className="badge badge-orange" style={{ marginBottom: 20 }}>Our Story</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                How it all started.
              </h2>
            </div>

            {/* Right: timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {[
                { year: '2021', title: 'The spark', desc: 'A small group of young professionals in Nashik discovered Forever Living Products and saw an opportunity beyond the 9-to-5. They started meeting weekly, sharing what worked, and building a culture of accountability.' },
                { year: '2022', title: 'Building the blueprint', desc: 'The group formalized its training system — daily live sessions, SMO workshops, and a structured mentorship ladder. Within a year, the Nashik branch had crossed 100 active members.' },
                { year: '2023', title: 'Scaling the network', desc: 'Word spread across Maharashtra. The branch onboarded its first batch of senior managers and launched the Achievers Portal to manage training, applications, and team directories digitally.' },
                { year: '2024+', title: 'The next chapter', desc: 'With 500+ members and growing, the Nashik branch is now one of the most active FLP communities in Western India — and still accepting ambitious new achievers every month.' },
              ].map((item, i, arr) => (
                <div key={i} className="timeline-item">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="timeline-dot" />
                    {i < arr.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.year}</div>
                    <h3 className="serif" style={{ fontSize: 24, letterSpacing: '-0.01em', marginBottom: 10 }}>{item.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: '#6a6a6a', fontWeight: 300 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── LEADERSHIP ─── */}
      <section style={{ padding: '100px 0', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider" style={{ margin: '0 auto 24px' }} />
            <div className="badge" style={{ marginBottom: 20 }}>Leadership</div>
            <h2 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              The people behind<br />
              <em style={{ color: 'var(--teal)' }}>the mission.</em>
            </h2>
          </div>

          <div className="leaders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                initials: 'SJ',
                name: 'Swayam Jadhav',
                role: 'Part CEO · Nashik Branch',
                tag: 'Leadership',
                tagColor: 'var(--teal)',
                tagBg: 'var(--teal-light)',
                bio: 'Swayam co-founded the Nashik branch in 2021 and has since built one of the fastest-growing FLP networks in Maharashtra. His focus is on mentorship-first leadership and building systems that scale.',
                accentColor: 'var(--teal)',
              },
              {
                initials: 'RD',
                name: 'Riya Deshmukh',
                role: 'Head of Training & Development',
                tag: 'Training',
                tagColor: 'var(--orange)',
                tagBg: 'var(--orange-light)',
                bio: 'Riya designed the Achievers training curriculum from the ground up — daily live modules, SMO frameworks, and onboarding flows. She ensures every new member hits the ground running.',
                accentColor: 'var(--orange)',
              },
              {
                initials: 'AK',
                name: 'Aarav Kulkarni',
                role: 'Senior Manager · Operations',
                tag: 'Operations',
                tagColor: '#8dc63f',
                tagBg: '#f2f9e6',
                bio: 'Aarav manages the day-to-day operations of the Nashik branch — from member onboarding and approvals to event coordination and the digital portal. The engine behind the machine.',
                accentColor: '#8dc63f',
              },
            ].map((person, i) => (
              <div key={i} className="leader-card">
                {/* Avatar */}
                <div className="leader-avatar" style={{ background: `linear-gradient(135deg, ${person.accentColor}22, ${person.accentColor}11)` }}>
                  <div className="avatar-initials" style={{ color: person.accentColor }}>{person.initials}</div>
                </div>
                {/* Info */}
                <div style={{ padding: '28px 32px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: person.tagBg, color: person.tagColor, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                    {person.tag}
                  </div>
                  <h3 className="serif" style={{ fontSize: 24, letterSpacing: '-0.01em', marginBottom: 4 }}>{person.name}</h3>
                  <p style={{ fontSize: 13, color: '#8a8a8a', fontWeight: 500, marginBottom: 16 }}>{person.role}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#6a6a6a', fontWeight: 300 }}>{person.bio}</p>
                </div>
                {/* Bottom accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${person.accentColor}, transparent)` }} />
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#aaa' }}>
            Replace placeholder names, roles, and bios with your client's real team details.
          </p>
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── VALUES ─── */}
      <section style={{ padding: '100px 0', background: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          <div className="values-section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <div>
              <div className="section-divider" />
              <div className="badge badge-orange" style={{ marginBottom: 20 }}>What we stand for</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
                Our core values.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6a6a6a', fontWeight: 300 }}>
                Everything we do — from how we train to how we recruit — is rooted in these principles. They're not just words on a wall. They're how we operate.
              </p>
            </div>

            <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '🎯', title: 'Results first', desc: 'We measure success in outcomes, not effort. Consistent, trackable progress.', bg: 'var(--teal-light)', color: 'var(--teal)' },
                { icon: '🤝', title: 'Community over competition', desc: 'Every member\'s win is a branch win. We rise together.', bg: 'var(--orange-light)', color: 'var(--orange)' },
                { icon: '📚', title: 'Never stop learning', desc: 'Daily training isn\'t optional — it\'s the foundation of everything.', bg: '#f2f9e6', color: '#8dc63f' },
                { icon: '🔓', title: 'Radical transparency', desc: 'No hidden costs, no vague promises. What you see is what you get.', bg: '#fff3f3', color: '#e05a5a' },
              ].map((v, i) => (
                <div key={i} className="value-pill card-lift">
                  <div className="value-icon" style={{ background: v.bg }}>
                    <span style={{ fontSize: 20 }}>{v.icon}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>{v.title}</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: '#7a7a7a', fontWeight: 300 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 0', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="cta-inner" style={{ background: '#0d0d0d', borderRadius: 36, padding: '80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg, transparent, var(--teal), var(--lime), transparent)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,170,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge" style={{ marginBottom: 24, background: 'rgba(0,170,200,0.1)', borderColor: 'rgba(0,170,200,0.2)', color: 'var(--teal)' }}>Ready to start?</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'white', marginBottom: 20 }}>
                Become an Achiever today.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px', fontWeight: 300 }}>
                Applications for the Nashik Branch are open. Zero upfront cost. 100% remote.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-primary" style={{ fontSize: 17, padding: '18px 44px' }}>Start your application 🚀</Link>
                <Link href="/#community" className="btn-ghost" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>Read member stories</Link>
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
        <a href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20joining%20the%20Achievers%20Club%20Nashik%20Branch!" target="_blank" rel="noopener noreferrer" className="wa-fab" aria-label="Chat on WhatsApp">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="white"/>
            <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="#25D366"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
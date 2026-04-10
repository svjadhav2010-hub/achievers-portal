'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  // Lock body scroll when mobile menu is open
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
          --white: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .serif { font-family: var(--font-serif); }


        /* Mobile nav drawer */
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
        .mobile-drawer.open {
          transform: translateX(0);
        }
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

        /* Hamburger */
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

        /* WhatsApp FAB */
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
          z-index: 150;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
        }
        .wa-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(37,211,102,0.55);
        }
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
          z-index: 150;
        }
        /* WhatsApp FAB wrapper */
        .wa-fab-wrapper {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 150;
        }
        .wa-fab-wrapper .wa-fab {
          position: static;
        }
        .wa-fab-wrapper .wa-fab-label {
          position: static;
          opacity: 0;
          transform: translateX(8px);
          pointer-events: none;
        }
        .wa-fab-wrapper:hover .wa-fab-label { opacity: 1; transform: translateX(0); }

        /* Hide desktop nav links on mobile */
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .desktop-nav-actions { display: none !important; }
          .hamburger { display: flex !important; }
        }

        /* Nav */
        .nav-pill {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
        }

        /* Fluid gradient blob */
        .hero-blob {
          background: radial-gradient(ellipse at 60% 50%, rgba(0,170,200,0.14) 0%, rgba(245,130,31,0.10) 45%, transparent 70%);
        }

        /* Grid texture */
        .grid-bg {
          background-image: 
            linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Number counter */
        .stat-num {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 8vw, 6rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--ink);
        }

        /* Marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-inner { animation: marquee 20s linear infinite; }

        /* Reveal */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .reveal-1 { animation-delay: 0.1s; }
        .reveal-2 { animation-delay: 0.25s; }
        .reveal-3 { animation-delay: 0.4s; }
        .reveal-4 { animation-delay: 0.55s; }

        /* Hover card lift */
        .card-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .card-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 64px -16px rgba(0,0,0,0.12);
        }

        /* Teal underline */
        .teal-underline {
          background: linear-gradient(90deg, var(--teal), var(--lime));
          background-size: 100% 3px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          padding-bottom: 4px;
        }

        /* Pill badge */
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

        /* Feature number */
        .step-num {
          font-family: var(--font-serif);
          font-size: 72px;
          line-height: 1;
          color: rgba(0,0,0,0.06);
          letter-spacing: -0.04em;
          position: absolute;
          top: -12px;
          right: 16px;
        }

        /* Testimonial card */
        .testi-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 24px;
          padding: 32px;
        }

        /* CTA section */
        .cta-gradient {
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
        }
        .cta-glow {
          background: radial-gradient(ellipse at 50% 0%, rgba(0,170,200,0.25) 0%, transparent 60%);
        }

        /* Orange CTA button */
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
        .btn-ghost:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        /* Section spacing */
        section { padding: 120px 0; }

        /* Divider */
        .section-divider {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal), var(--lime));
          border-radius: 2px;
          margin-bottom: 24px;
        }

        /* Logo text */
        .logo-text {
          font-family: var(--font-serif);
          font-size: 20px;
          letter-spacing: -0.02em;
        }

        /* Wing accent */
        .wing-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Floating card */
        @keyframes float-a {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .float-a { animation: float-a 5s ease-in-out infinite; }
        .float-b { animation: float-b 6s ease-in-out infinite; }

        /* Horizontal rule with gradient */
        .hr-gradient {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent);
        }

        /* Mobile */
        @media (max-width: 768px) {
          section { padding: 72px 0; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-grid > div:last-child { display: none !important; }
          .blueprint-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .blueprint-grid > div:first-child { position: static !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .remote-card { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; padding: 36px 28px !important; grid-column: auto !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          .testi-grid > div:nth-child(2) { margin-top: 0 !important; aspect-ratio: 16/9 !important; }
          .testi-grid > div:nth-child(3) { margin-top: 0 !important; }
          .cta-gradient { padding: 60px 28px !important; border-radius: 24px !important; }
          .reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ─── NAVIGATION ─── */}
      {/* ─── MOBILE DRAWER ─── */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {(['#services', '#benefits', '#community', '/about', '/events', '/contact'] as string[]).map((href, i) => (
          <a key={i} href={href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            {['Services', 'Why Join', 'Stories', 'About', 'Events', 'Contact'][i]}
          </a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, marginTop: 16 }}>
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center', padding: '14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Login</Link>
          <Link href="/register" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center', justifyContent: 'center' }}>Join Now ↗</Link>
        </div>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, padding: '16px 24px' }}>
        <div className="nav-pill" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/icon.png" alt="Achievers Club" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 500, color: '#5a5a5a' }}>
            <Link href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
            <Link href="#benefits" style={{ textDecoration: 'none', color: 'inherit' }}>Why Join</Link>
            <Link href="#community" style={{ textDecoration: 'none', color: 'inherit' }}>Stories</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
            <Link href="/events" style={{ textDecoration: 'none', color: 'inherit' }}>Events</Link>
            <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
          </div>
          <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#5a5a5a', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
              Join Now <span>↗</span>
            </Link>
          </div>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ zIndex: 300 }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ─── WHATSAPP FAB ─── */}
      {/* WhatsApp FAB — replace 91XXXXXXXXXX with actual number */}
      <div className="wa-fab-wrapper">
        <div className="wa-fab-label">Chat with us on WhatsApp</div>
        <a
          href="https://wa.me/9146531857?text=Hi%2C%20I%27m%20interested%20in%20joining%20the%20Achievers%20Club%20Nashik%20Branch!"
          target="_blank"
          rel="noopener noreferrer"
          className="wa-fab"
          aria-label="Chat on WhatsApp"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="white"/>
            <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="#25D366"/>
          </svg>
        </a>
      </div>

      {/* ─── HERO ─── */}
      <section className="grid-bg hero-blob" style={{ paddingTop: 160, paddingBottom: 120, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,130,31,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            
            {/* Left: Copy */}
            <div>
              <div className="badge reveal reveal-1" style={{ marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                Nashik Branch · Now Onboarding
              </div>

              <h1 className="serif reveal reveal-2" style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0d0d0d', marginBottom: 28 }}>
                Build wealth<br />
                <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>on your terms.</em>
              </h1>

              <p className="reveal reveal-3" style={{ fontSize: 18, lineHeight: 1.7, color: '#5a5a5a', maxWidth: 440, marginBottom: 44, fontWeight: 300 }}>
                A premium digital community where young entrepreneurs learn, network, and generate passive income — with zero upfront investment.
              </p>

              <div className="reveal reveal-4" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-primary">
                  Start Your Application <span style={{ fontSize: 18 }}>→</span>
                </Link>
                <Link href="#community" className="btn-ghost">
                  See member stories
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="reveal reveal-4" style={{ marginTop: 56, display: 'flex', gap: 32, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#0d0d0d', fontFamily: 'var(--font-serif)' }}>500+</div>
                  <div style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2 }}>Active achievers</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(0,0,0,0.1)' }} />
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#0d0d0d', fontFamily: 'var(--font-serif)' }}>4.9★</div>
                  <div style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2 }}>Google rating</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(0,0,0,0.1)' }} />
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#0d0d0d', fontFamily: 'var(--font-serif)' }}>₹0</div>
                  <div style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2 }}>To get started</div>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div style={{ position: 'relative', height: 560, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              
              {/* Main hero image container */}
              <div style={{ width: 320, height: 440, borderRadius: '200px 200px 120px 120px', overflow: 'hidden', background: 'linear-gradient(160deg, #e0f6fb 0%, #d4f0f9 100%)', border: '2px solid rgba(0,170,200,0.15)', position: 'relative', zIndex: 2, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)' }}>
                <img src="/heroo.png" alt="Achiever" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Floating card: earnings */}
              <div className="float-a" style={{ position: 'absolute', left: -20, top: 80, background: 'white', borderRadius: 20, padding: '16px 20px', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)', zIndex: 3, minWidth: 160 }}>
                <div style={{ fontSize: 11, color: '#8a8a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Monthly Target</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>₹20–30k</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <span style={{ color: 'var(--lime)', fontSize: 12, fontWeight: 600 }}>↑ 24%</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>avg. growth</span>
                </div>
              </div>

              {/* Floating card: community */}
              <div className="float-b" style={{ position: 'absolute', right: -16, bottom: 100, background: 'white', borderRadius: 20, padding: '16px 20px', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)', zIndex: 3 }}>
                <div style={{ display: 'flex', gap: -6, marginBottom: 8 }}>
                  {['#00aac8','#f5821f','#8dc63f','#00aac8'].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, opacity: 0.85 + i * 0.05 }} />
                  ))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d' }}>500+ achievers</div>
                <div style={{ fontSize: 11, color: '#8a8a8a' }}>in Nashik branch</div>
              </div>

              {/* Decorative ring */}
              <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', border: '1px dashed rgba(0,170,200,0.2)', zIndex: 1 }} />
              <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: '1px dashed rgba(245,130,31,0.15)', zIndex: 1 }} />
            </div>

          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div style={{ background: '#0d0d0d', padding: '20px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="marquee-inner" style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}>
          {[...Array(3)].map((_, set) => (
            <div key={set} style={{ display: 'flex', gap: 0 }}>
              {['Digital Entrepreneurship', 'Zero Investment', 'Passive Income', 'Remote Workflow', 'Elite Mentorship', 'SMO Mastery', 'Financial Freedom', 'Start Young · Retire Young', '500+ Achievers'].map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 24, padding: '0 32px', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: i % 3 === 0 ? 'var(--teal)' : i % 3 === 1 ? 'var(--orange)' : 'rgba(255,255,255,0.4)' }}>
                  {item}
                  <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── SERVICES / BLUEPRINT ─── */}
      <section id="services" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div className="blueprint-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
            {/* Left sticky label */}
            <div style={{ position: 'sticky', top: 140 }}>
              <div className="section-divider" />
              <div className="badge" style={{ marginBottom: 20 }}>The Blueprint</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
                A structured path to passive revenue.
              </h2>
              <p style={{ color: '#5a5a5a', lineHeight: 1.7, fontSize: 16, fontWeight: 300 }}>
                Three interlocking phases, each building on the last. No shortcuts — just a proven system.
              </p>
            </div>

            {/* Right: step cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  num: '01',
                  icon: '📈',
                  title: 'Skill Acquisition',
                  desc: 'Master Social Media Optimization and network building through structured daily live training modules curated by senior mentors.',
                  accent: 'var(--teal)',
                  bg: 'var(--teal-light)',
                },
                {
                  num: '02',
                  icon: '🤝',
                  title: 'Elite Mentorship',
                  desc: 'Paired directly with senior managers focused on personal development and downline team building. Real guidance, real accountability.',
                  accent: 'var(--orange)',
                  bg: 'var(--orange-light)',
                },
                {
                  num: '03',
                  icon: '🏆',
                  title: 'Revenue Generation',
                  desc: 'Structured effort converts into sustainable passive income streams and elite brand recognition across the digital network.',
                  accent: 'var(--lime)',
                  bg: '#f2f9e6',
                },
              ].map((step, i) => (
                <div key={i} className="card-lift" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 24, padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
                  <div className="step-num">{step.num}</div>
                  <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: step.accent, marginBottom: 8 }}>Phase {step.num}</div>
                      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 12, fontFamily: 'var(--font-serif)' }}>{step.title}</h3>
                      <p style={{ color: '#6a6a6a', lineHeight: 1.7, fontSize: 15, fontWeight: 300 }}>{step.desc}</p>
                    </div>
                  </div>
                  {/* Bottom accent line */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${step.accent}, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── STATS ─── */}
      <section style={{ background: 'var(--paper)', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(0,0,0,0.06)', borderRadius: 24, overflow: 'hidden' }}>
            {[
              { val: '500+', label: 'Active achievers', sub: 'Nashik branch' },
              { val: '₹30k', label: 'Avg. monthly target', sub: 'Per member' },
              { val: '4.9', label: 'Google rating', sub: 'Verified reviews' },
              { val: '100%', label: 'Remote workflow', sub: 'Work from anywhere' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'white', padding: '48px 36px', textAlign: 'center' }}>
                <div className="stat-num">{stat.val}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d', marginTop: 12, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 12, color: '#aaa', fontWeight: 400 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hr-gradient" />

      {/* ─── BENEFITS ─── */}
      <section id="benefits" style={{ background: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="badge badge-orange" style={{ marginBottom: 20 }}>Why Join</div>
            <h2 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Redefining the hustle.
            </h2>
          </div>

          {/* Bento grid */}
          <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto', gap: 20 }}>
            
            {/* Card 1: Big */}
            <div className="card-lift" style={{ background: 'white', borderRadius: 28, padding: '56px 52px', border: '1px solid rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,200,0.08) 0%, transparent 70%)' }} />
              <div style={{ fontSize: 48, marginBottom: 24 }}>🏆</div>
              <h3 className="serif" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>Start young,<br />retire young.</h3>
              <p style={{ color: '#6a6a6a', fontSize: 16, lineHeight: 1.7, maxWidth: 400, fontWeight: 300 }}>Stop trading time for money. Build digital assets and automated networks that generate passive income, giving you financial freedom decades early.</p>
            </div>

            {/* Card 2: Orange */}
            <div className="card-lift" style={{ background: 'var(--orange)', borderRadius: 28, padding: '48px 40px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="serif" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'white', marginBottom: 16 }}>Zero<br />upfront<br />costs.</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.6, fontWeight: 300 }}>Your capital stays in your pocket. We invest in skills, not starter kits.</p>
              </div>
              <div style={{ fontSize: 80, textAlign: 'right', lineHeight: 1 }}>💸</div>
            </div>

            {/* Card 3: Dark - full width */}
            <div className="card-lift remote-card" style={{ background: '#0d0d0d', borderRadius: 28, padding: '52px', gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 48, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,170,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="badge" style={{ marginBottom: 20, background: 'rgba(0,170,200,0.1)', borderColor: 'rgba(0,170,200,0.25)', color: 'var(--teal)' }}>100% Remote</div>
                <h3 className="serif" style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'white', marginBottom: 16 }}>Your office is wherever<br />your laptop is.</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, maxWidth: 480, fontWeight: 300 }}>Our streamlined digital ecosystem lets you scale globally without leaving your room. Build your empire, on your schedule.</p>
              </div>
              <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <Link href="/register" className="btn-primary" style={{ fontSize: 17, padding: '18px 40px' }}>
                  Begin your journey →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="community" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="section-divider" />
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                Verified by Google.<br />
                <em style={{ color: 'var(--teal)' }}>Loved by members.</em>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--orange)', fontSize: 20 }}>★</span>)}
              <span style={{ marginLeft: 8, fontWeight: 600, fontSize: 16 }}>4.9 / 5</span>
              <span style={{ marginLeft: 4, color: '#8a8a8a', fontSize: 15 }}>on Google</span>
            </div>
          </div>

          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'start' }}>
            
            {/* Review 1 */}
            <div className="testi-card card-lift" style={{ marginTop: 0 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--orange)', fontSize: 16 }}>★</span>)}
              </div>
              <p style={{ color: '#3a3a3a', lineHeight: 1.75, fontSize: 15, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>
                "I was skeptical about the zero upfront investment claim — but they genuinely mean it. The mentorship gave me more practical business knowledge than my entire college degree."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>R</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Rahul D.</div>
                  <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Consistently hitting targets</div>
                </div>
              </div>
            </div>

            {/* Video card */}
            <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', background: '#111', aspectRatio: '9/16', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.2)', marginTop: 32 }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 4, cursor: 'pointer', transition: 'all 0.3s' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <span style={{ background: '#e53e3e', color: 'white', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 100, marginBottom: 10, display: 'inline-block' }}>Live story</span>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>Sneha's Journey</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 }}>"How I scaled to ₹30k/month, remotely."</div>
              </div>
            </div>

            {/* Google review */}
            <div className="testi-card card-lift" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Google Reviews</span>
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700 }}>4.9</span>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--orange)', fontSize: 16 }}>★</span>)}
              </div>
              <p style={{ color: '#3a3a3a', lineHeight: 1.75, fontSize: 15, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>
                "Absolutely brilliant platform. The Nashik community is incredibly supportive. Highly recommend to anyone serious about building a digital career."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a73e8', fontWeight: 700, fontSize: 16 }}>A</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Aditya K.</div>
                  <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 2 }}>Local Guide · 12 reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section id="contact" style={{ background: 'var(--paper)', paddingBottom: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <div className="cta-gradient" style={{ borderRadius: 36, padding: '100px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="cta-glow" style={{ position: 'absolute', inset: 0 }} />
            
            {/* Teal accent line at top */}
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg, transparent, var(--teal), var(--lime), transparent)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge" style={{ marginBottom: 28, background: 'rgba(0,170,200,0.1)', borderColor: 'rgba(0,170,200,0.2)', color: 'var(--teal)' }}>Limited spots · Nashik</div>
              <h2 className="serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'white', marginBottom: 24 }}>
                Ready to build your<br />digital empire?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px', fontWeight: 300 }}>
                The Nashik Branch is actively onboarding new digital entrepreneurs. Zero upfront costs. 100% remote. Start today.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-primary" style={{ fontSize: 18, padding: '18px 44px' }}>
                  Start your application 🚀
                </Link>
                <Link href="#community" className="btn-ghost" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
                  Read member stories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: '#0d0d0d', padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <img src="/icon.png" alt="" style={{ height: 28, width: 'auto', opacity: 0.9 }} />
                <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: 18, letterSpacing: '-0.01em' }}>The Achievers Club</span>
              </div>
              <p style={{ color: '#4a4a4a', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Start Young · Retire Young</p>
            </div>
            <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500, color: '#4a4a4a' }}>
              <Link href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</Link>
              <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Support</Link>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <a href="https://www.instagram.com/achieversclubnashik_official/" target="_blank" rel="noopener noreferrer" title="Instagram"
                style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#666" stroke="none"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/work-from-anywhere-anytime/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#666"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UCp09BjyDPbOyeJmnc2FRCTg" target="_blank" rel="noopener noreferrer" title="YouTube"
                style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#666"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a1a1a"/></svg>
              </a>
            </div>
            <div style={{ fontSize: 13, color: '#3a3a3a' }}>
              © {new Date().getFullYear()} The Achievers Club · Nashik
            </div>
          </div>
        </footer>
      </section>

    </div>
  );
}
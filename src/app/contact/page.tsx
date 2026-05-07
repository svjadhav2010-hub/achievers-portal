'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setFormStatus('success');
    } catch (error: any) {
      setFormStatus('error');
      console.error('Contact form error:', error.message);
    }
  };

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
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-ghost { background: transparent; color: var(--ink); border: 1px solid rgba(0,0,0,0.15); border-radius: 100px; padding: 14px 28px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }
        .section-divider { width: 48px; height: 3px; background: linear-gradient(90deg, var(--teal), var(--lime)); border-radius: 2px; margin-bottom: 24px; }
        .hr-gradient { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent); }

        /* Form */
        .form-field { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 13px; font-weight: 600; color: #3a3a3a; }
        .form-input {
          width: 100%; padding: 14px 18px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 14px;
          font-size: 15px;
          font-family: var(--font-sans);
          color: var(--ink);
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,170,200,0.1); }
        .form-input::placeholder { color: #bbb; }
        textarea.form-input { resize: vertical; min-height: 140px; line-height: 1.6; }
        select.form-input { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }

        /* Contact info card */
        .info-card { background: white; border: 1px solid rgba(0,0,0,0.06); border-radius: 20px; padding: 24px 28px; display: flex; align-items: flex-start; gap: 16px; transition: transform 0.3s, box-shadow 0.3s; }
        .info-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -8px rgba(0,0,0,0.08); }
        .info-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px; }

        /* Social pill */
        .social-pill { display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: white; border: 1px solid rgba(0,0,0,0.08); border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; color: var(--ink); transition: all 0.2s; }
        .social-pill:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px); }

        /* Success state */
        .success-box { background: #f0fdf4; border: 1px solid rgba(34,197,94,0.2); border-radius: 20px; padding: 48px 40px; text-align: center; }

        /* WhatsApp CTA card */
        .wa-card { background: #25D366; border-radius: 24px; padding: 36px 40px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }

        /* WhatsApp FAB */
        .wa-fab-wrapper { position: fixed; bottom: 28px; right: 28px; display: flex; align-items: center; gap: 10px; z-index: 150; }
        .wa-fab { width: 58px; height: 58px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(37,211,102,0.45); cursor: pointer; text-decoration: none; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s; }
        .wa-fab:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(37,211,102,0.55); }
        .wa-fab-label { background: white; color: #0d0d0d; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); white-space: nowrap; opacity: 0; transform: translateX(8px); transition: all 0.25s; pointer-events: none; }
        .wa-fab-wrapper:hover .wa-fab-label { opacity: 1; transform: translateX(0); }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .wa-card { flex-direction: column !important; text-align: center !important; }
          .form-card { padding: 28px 20px !important; border-radius: 20px !important; }
          .contact-hero-section { padding-top: 100px !important; padding-bottom: 40px !important; }
          .contact-hero-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; margin-bottom: 36px !important; }
          .contact-hero-row p { max-width: 100% !important; }
        }
      `}</style>

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {([['/', 'Home'], ['/#services', 'Services'], ['/#benefits', 'Why Join'], ['/about', 'About'], ['/events', 'Events'], ['/contact', 'Contact']] as [string,string][]).map(([href, label]) => (
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
            <Link href="/events" style={{ textDecoration: 'none', color: 'inherit' }}>Events</Link>
            <Link href="/contact" style={{ textDecoration: 'none', color: 'var(--teal)', fontWeight: 600 }}>Contact</Link>
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
      <section className="contact-hero-section" style={{ paddingTop: 140, paddingBottom: 80, background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="section-divider" />
          <div className="badge" style={{ marginBottom: 20 }}>Get in touch</div>
          <div className="contact-hero-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 64 }}>
            <h1 className="serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              We'd love to<br />
              <em style={{ color: 'var(--teal)' }}>hear from you.</em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#5a5a5a', fontWeight: 300, maxWidth: 380 }}>
              Have a question about joining, events, or mentorship? Reach out and our team will get back to you within 24 hours.
            </p>
          </div>

          {/* ─── MAIN GRID ─── */}
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>

            {/* ─── FORM ─── */}
            <div className="form-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 28, padding: '48px 44px' }}>
              {formStatus === 'success' ? (
                <div className="success-box">
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <h3 className="serif" style={{ fontSize: 28, marginBottom: 12, letterSpacing: '-0.02em' }}>Message sent!</h3>
                  <p style={{ color: '#5a5a5a', fontSize: 15, lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>
                    Thanks for reaching out. Our team will get back to you within 24 hours. In the meantime, feel free to explore our community.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={() => { setFormStatus('idle'); setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' }); }}>
                      Send another message
                    </button>
                    <Link href="/register" className="btn-ghost">Join the community →</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 className="serif" style={{ fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Send us a message</h2>
                    <p style={{ fontSize: 14, color: '#8a8a8a', fontWeight: 300 }}>We read every message and respond personally.</p>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-field">
                      <label className="form-label">Full name *</label>
                      <input name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder="Rahul Sharma" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Email address *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-field">
                      <label className="form-label">Phone number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="form-input">
                        <option>General Enquiry</option>
                        <option>Joining the Community</option>
                        <option>Mentorship</option>
                        <option>Events & Training</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Message *</label>
                    <textarea name="message" required value={form.message} onChange={handleChange} className="form-input" placeholder="Tell us what you'd like to know..." />
                  </div>

                  {formStatus === 'error' && (
                    <div style={{ background: '#fff3f3', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: 14, color: '#dc3545', fontWeight: 500 }}>
                      Something went wrong. Please try again or contact us on WhatsApp.
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={formStatus === 'sending'} style={{ alignSelf: 'flex-start', padding: '14px 36px', fontSize: 15 }}>
                    {formStatus === 'sending' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        Sending…
                      </>
                    ) : 'Send message →'}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>
              )}
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Contact info cards */}
              {[
                { icon: '📍', iconBg: 'var(--teal-light)', label: 'Location', value: 'Nashik, Maharashtra', sub: 'India — 422001' },
                { icon: '📧', iconBg: 'var(--orange-light)', label: 'Email', value: 'hello@achieversnashik.in', sub: 'We reply within 24 hours' },
                { icon: '📞', iconBg: '#f2f9e6', label: 'Phone', value: '+91 91465 31857', sub: 'Mon – Sat, 10 AM – 7 PM' },
                { icon: '🕐', iconBg: '#fff3f3', label: 'Response time', value: 'Under 24 hours', sub: 'Usually much faster' },
              ].map((item, i) => (
                <div key={i} className="info-card">
                  <div className="info-icon" style={{ background: item.iconBg }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{item.sub}</div>
                  </div>
                </div>
              ))}

              {/* WhatsApp quick contact card */}
              <div className="wa-card">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Fastest response</div>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4, letterSpacing: '-0.01em' }}>Chat on WhatsApp</h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>Get a reply in minutes, not hours.</p>
                </div>
                <a
                  href="https://wa.me/917249822874?text=Hi%2C%20I%20have%20a%20question%20about%20the%20Achievers%20Club%20Nashik!"
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: 'white', color: '#25D366', borderRadius: 100, padding: '12px 24px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                    <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="#25D366"/>
                    <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="white"/>
                  </svg>
                  Message us
                </a>
              </div>

              {/* Social links */}
              <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '24px 28px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Follow us</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Instagram', handle: '@achieversclubnashik_official', color: '#E1306C', icon: '📸', href: 'https://www.instagram.com/achieversclubnashik_official/' },
                    { label: 'YouTube', handle: 'Achievers Club', color: '#FF0000', icon: '▶', href: 'https://www.youtube.com/channel/UCp09BjyDPbOyeJmnc2FRCTg' },
                    { label: 'LinkedIn', handle: 'The Achievers Club', color: '#0077B5', icon: '💼', href: 'https://www.linkedin.com/company/work-from-anywhere-anytime/?originalSubdomain=in' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-pill">
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0d0d0d', padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <img src="/icon.png" alt="" style={{ height: 28, width: 'auto', opacity: 0.9 }} />
              <span className="serif" style={{ color: 'white', fontSize: 18, letterSpacing: '-0.01em' }}>The Achievers Club</span>
            </div>
            <p style={{ color: '#4a4a4a', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Start Young · Retire Young</p>
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500, color: '#4a4a4a' }}>
            <Link href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</Link>
            <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Support</Link>
          </div>
          <div style={{ fontSize: 13, color: '#3a3a3a' }}>© {new Date().getFullYear()} The Achievers Club · Nashik</div>
        </div>
      </footer>

      {/* ─── WHATSAPP FAB ─── */}
      <div className="wa-fab-wrapper">
        <div className="wa-fab-label">Chat with us on WhatsApp</div>
        <a href="https://wa.me/917249822874?text=Hi%2C%20I%20have%20a%20question%20about%20the%20Achievers%20Club!" target="_blank" rel="noopener noreferrer" className="wa-fab" aria-label="Chat on WhatsApp">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="white"/>
            <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="#25D366"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
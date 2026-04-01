'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
}

export default function MemberDirectory() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'MENTOR' | 'MEMBER'>('all');

  useEffect(() => {
    fetch('/api/members')
      .then(res => {
        if (res.status === 401) { router.push('/login'); return null; }
        return res.json();
      })
      .then(data => {
        if (data) setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter(m => {
    const matchSearch = m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.role === filter;
    return matchSearch && matchFilter;
  });

  const roleColors: Record<string, { color: string; bg: string }> = {
    ADMIN:  { color: 'var(--orange)', bg: 'var(--orange-light)' },
    MENTOR: { color: '#7c3aed',       bg: '#f3f0ff' },
    MEMBER: { color: 'var(--teal)',   bg: 'var(--teal-light)' },
  };

  const counts = {
    all: members.length,
    ADMIN: members.filter(m => m.role === 'ADMIN').length,
    MENTOR: members.filter(m => m.role === 'MENTOR').length,
    MEMBER: members.filter(m => m.role === 'MEMBER').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        :root {
          --teal: #00aac8; --teal-light: #e0f6fb;
          --orange: #f5821f; --orange-light: #fef3e8;
          --lime: #8dc63f; --ink: #0d0d0d;
          --paper: #f8f7f4; --paper-warm: #f2f0ec;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: var(--font-serif); }

        .nav-bar { background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 0 32px; position: sticky; top: 0; z-index: 50; }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }

        .search-input {
          width: 100%; padding: 12px 18px 12px 44px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 14px; font-size: 14px;
          font-family: var(--font-sans);
          background: white; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          color: var(--ink);
        }
        .search-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,170,200,0.1); }
        .search-input::placeholder { color: #bbb; }

        .filter-chip { padding: 7px 18px; border-radius: 100px; border: 1px solid rgba(0,0,0,0.1); background: transparent; font-size: 13px; font-weight: 500; color: #5a5a5a; cursor: pointer; transition: all 0.2s; }
        .filter-chip:hover { border-color: var(--teal); color: var(--teal); }
        .filter-chip.active { background: #0d0d0d; color: white; border-color: #0d0d0d; font-weight: 600; }

        .member-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          padding: 24px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .member-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
        }

        .btn-ghost { background: transparent; color: var(--ink); border: 1px solid rgba(0,0,0,0.15); border-radius: 100px; padding: 8px 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        .section-divider { width: 48px; height: 3px; background: linear-gradient(90deg, var(--teal), var(--lime)); border-radius: 2px; margin-bottom: 16px; }

        @media (max-width: 768px) {
          .dir-grid { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 0 4px; }
          main { padding: 24px 16px !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/icon.png" alt="" style={{ height: 32 }} />
            <span className="serif" style={{ fontSize: 16, color: '#0d0d0d', letterSpacing: '-0.01em' }}>Achievers Portal</span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/dashboard" className="btn-ghost">My Dashboard</Link>
            <button className="btn-ghost" onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login'; }}>
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <h1 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', color: '#0d0d0d', marginBottom: 6 }}>
                Member Directory
              </h1>
              <p style={{ fontSize: 14, color: '#8a8a8a' }}>
                {members.length} active members · Nashik Branch
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ● Members only
            </div>
          </div>

          {/* Search + Filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['all', 'ADMIN', 'MENTOR', 'MEMBER'] as const).map(f => (
                <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? `All (${counts.all})` : `${f.charAt(0) + f.slice(1).toLowerCase()} (${counts[f]})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa', fontSize: 14 }}>
            Loading members...
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#3a3a3a', marginBottom: 8 }}>No members found</div>
            <div style={{ fontSize: 13, color: '#aaa' }}>Try a different search or filter</div>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filtered.map(member => {
              const rc = roleColors[member.role] || roleColors.MEMBER;
              const initials = member.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
              const joinDate = new Date(member.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

              return (
                <div key={member.id} className="member-card">
                  {/* Top: avatar + role */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: rc.bg, border: `1.5px solid ${rc.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: rc.color, fontFamily: 'var(--font-serif)', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rc.color, background: rc.bg, borderRadius: 100, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {member.role}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0d0d0d', marginBottom: 4, lineHeight: 1.3 }}>{member.fullName}</div>
                    <div style={{ fontSize: 13, color: '#8a8a8a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</div>
                  </div>

                  {/* Footer */}
                  <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>
                      Joined {joinDate}
                    </div>
                    <a
                      href={member.phone
                        ? `https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(member.fullName)}!`
                        : `https://wa.me/?text=Hi%20${encodeURIComponent(member.fullName)}!`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ width: 32, height: 32, borderRadius: '50%', background: member.phone ? '#f2f9f3' : '#f5f5f5', border: `1px solid ${member.phone ? 'rgba(37,211,102,0.2)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s', opacity: member.phone ? 1 : 0.4 }}
                      title={member.phone ? `Message ${member.fullName} on WhatsApp` : 'No WhatsApp number on file'}
                    >
                      <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
                        <path d="M15 2C7.82 2 2 7.82 2 15c0 2.3.62 4.45 1.7 6.3L2 28l6.87-1.67A13 13 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2Z" fill="#25D366"/>
                        <path d="M21.5 18.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="white"/>
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
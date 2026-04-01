'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    joinedAt: string;
  };
  stats: {
    totalMembers: number;
  };
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  created_at: string;
}

const MODULES = [
  { id: 1, title: 'Digital Networking Basics', desc: 'Build your professional digital presence from scratch.', status: 'completed', progress: 100, accent: 'var(--lime)' },
  { id: 2, title: 'Social Media Optimization (SMO)', desc: 'Master SMO strategies that convert followers into leads.', status: 'in-progress', progress: 60, accent: 'var(--teal)' },
  { id: 3, title: 'Downline Team Building', desc: 'Learn how to recruit, onboard, and retain your team.', status: 'locked', progress: 0, accent: '#aaa' },
  { id: 4, title: 'Passive Income Frameworks', desc: 'Build systems that earn while you sleep.', status: 'locked', progress: 0, accent: '#aaa' },
];

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setTasks(d); })
      .catch(() => {});
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setError(json.error);
          router.push('/login');
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard.');
        setLoading(false);
      });
  }, []);

  const initials = data?.user.fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '..';

  const joinDate = data?.user.joinedAt
    ? new Date(data.user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const addTask = async () => {
    if (!newTask.trim()) return;
    setTaskLoading(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask.trim(), due_date: newDueDate || null }),
    });
    const d = await res.json();
    if (d.success) {
      setTasks(prev => [{ id: d.id, title: newTask.trim(), status: 'pending', due_date: newDueDate || null, created_at: new Date().toISOString() }, ...prev]);
      setNewTask(''); setNewDueDate('');
    }
    setTaskLoading(false);
  };

  const updateTaskStatus = async (id: string, status: string) => {
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t));
  };

  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedModules = MODULES.filter(m => m.status === 'completed').length;
  const overallProgress = Math.round((completedModules / MODULES.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        :root {
          --teal: #00aac8; --teal-light: #e0f6fb;
          --orange: #f5821f; --orange-light: #fef3e8;
          --lime: #8dc63f; --ink: #0d0d0d;
          --paper: #f8f7f4; --paper-warm: #f2f0ec;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: var(--font-serif); }

        .nav-bar {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding: 14px 24px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .stat-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          padding: 24px 28px;
        }

        .module-row {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .module-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -8px rgba(0,0,0,0.08);
        }
        .module-row.locked { opacity: 0.5; cursor: not-allowed; }

        .progress-bar-bg {
          height: 6px;
          background: rgba(0,0,0,0.07);
          border-radius: 3px;
          overflow: hidden;
          flex: 1;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary {
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .btn-primary:hover { background: #e07018; transform: scale(1.03); }

        .btn-ghost {
          background: transparent;
          color: var(--ink);
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 100px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #7a7a7a;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { border-color: #e05a5a; color: #e05a5a; }

        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-bar { padding: 12px 16px !important; }
          .nav-bar .btn-ghost { display: none !important; }
          main { padding: 24px 16px !important; }
          .module-row { gap: 12px !important; padding: 16px !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="nav-bar">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/icon.png" alt="" style={{ height: 32, width: 'auto' }} />
            <span className="serif" style={{ fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Achievers Portal</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/directory" className="btn-ghost">Member Directory</Link>
            <button
              className="logout-btn"
              onClick={async () => {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa', fontSize: 15 }}>
            Loading your dashboard...
          </div>
        )}

        {!loading && data && (
          <>
            {/* ─── HEADER ─── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <h1 className="serif" style={{ fontSize: 28, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 4 }}>
                    Welcome back, {data.user.fullName.split(' ')[0]}!
                  </h1>
                  <p style={{ fontSize: 14, color: '#8a8a8a' }}>Member since {joinDate} · {data.user.email}</p>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ● Active Member
              </div>
            </div>

            {/* ─── STATS STRIP ─── */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Community size', val: `${data.stats.totalMembers}`, sub: 'approved members', accent: 'var(--teal)' },
                { label: 'Modules completed', val: `${completedModules}/${MODULES.length}`, sub: 'training modules', accent: 'var(--orange)' },
                { label: 'Overall progress', val: `${overallProgress}%`, sub: 'of curriculum', accent: 'var(--lime)' },
                { label: 'Your role', val: data.user.role, sub: 'access level', accent: '#8a8a8a' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.label}</div>
                  <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.02em', color: s.accent, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ─── MAIN GRID ─── */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

              {/* ─── TRAINING MODULES ─── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>Training Modules</h2>
                  <span style={{ fontSize: 13, color: '#aaa' }}>{completedModules} of {MODULES.length} complete</span>
                </div>

                {/* Overall progress bar */}
                <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, padding: '16px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#5a5a5a', flexShrink: 0 }}>Overall</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, var(--teal), var(--lime))' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>{overallProgress}%</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MODULES.map((mod, i) => (
                    <div key={mod.id} className={`module-row${mod.status === 'locked' ? ' locked' : ''}`}>
                      {/* Number */}
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: mod.status === 'locked' ? '#f0f0f0' : mod.status === 'completed' ? '#f2f9e6' : 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {mod.status === 'completed'
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          : mod.status === 'in-progress'
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: mod.status === 'locked' ? '#aaa' : 'var(--ink)', marginBottom: 3 }}>{mod.title}</div>
                        <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.4 }}>{mod.desc}</div>
                        {mod.status === 'in-progress' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                            <div className="progress-bar-bg" style={{ maxWidth: 160 }}>
                              <div className="progress-bar-fill" style={{ width: `${mod.progress}%`, background: 'var(--teal)' }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>{mod.progress}%</span>
                          </div>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="badge-pill" style={{
                        background: mod.status === 'completed' ? '#f2f9e6' : mod.status === 'in-progress' ? 'var(--teal-light)' : '#f5f5f5',
                        color: mod.status === 'completed' ? '#8dc63f' : mod.status === 'in-progress' ? 'var(--teal)' : '#bbb',
                        flexShrink: 0,
                      }}>
                        {mod.status === 'completed' ? 'Done' : mod.status === 'in-progress' ? 'In progress' : 'Locked'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── MY TASKS ─── */}
              <div style={{ marginTop: 24 }}>
                <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>My Tasks</h2>
                      <p style={{ fontSize: 12, color: '#aaa' }}>Your personal to-do list + tasks assigned by your mentor</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {tasks.filter(t => t.status === 'completed').length > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#8dc63f', background: '#f2f9e6', borderRadius: 100, padding: '3px 10px' }}>
                          {tasks.filter(t => t.status === 'completed').length} done
                        </span>
                      )}
                      {tasks.filter(t => t.status === 'pending').length > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-light)', borderRadius: 100, padding: '3px 10px' }}>
                          {tasks.filter(t => t.status === 'pending').length} pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add task row */}
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask()}
                      placeholder="Add a new task and press Enter..."
                      style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--ink)' }}
                    />
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      style={{ padding: '9px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', color: '#5a5a5a' }}
                    />
                    <button onClick={addTask} disabled={taskLoading || !newTask.trim()} className="btn-primary"
                      style={{ padding: '9px 18px', fontSize: 13, opacity: !newTask.trim() ? 0.5 : 1 }}>
                      + Add
                    </button>
                  </div>

                  {/* Task list */}
                  <div style={{ padding: '8px 0' }}>
                    {tasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontSize: 13 }}>
                        No tasks yet — add one above or check back after your mentor assigns one
                      </div>
                    )}
                    {tasks.map(task => (
                      <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Status circle button */}
                        <button
                          onClick={() => updateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'pending')}
                          style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${task.status === 'completed' ? '#8dc63f' : task.status === 'in_progress' ? 'var(--teal)' : 'rgba(0,0,0,0.2)'}`, background: task.status === 'completed' ? '#8dc63f' : task.status === 'in_progress' ? 'var(--teal-light)' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          title={`Mark as ${task.status === 'pending' ? 'in progress' : task.status === 'in_progress' ? 'completed' : 'pending'}`}
                        >
                          {task.status === 'completed' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          {task.status === 'in_progress' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />}
                        </button>

                        {/* Task info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: task.status === 'completed' ? '#aaa' : 'var(--ink)', textDecoration: task.status === 'completed' ? 'line-through' : 'none', lineHeight: 1.4 }}>
                            {task.title}
                          </div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                            {task.due_date && (
                              <span style={{ fontSize: 11, color: new Date(task.due_date) < new Date() && task.status !== 'completed' ? '#e05a5a' : '#aaa', fontWeight: 500 }}>
                                Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                            <span style={{ fontSize: 11, fontWeight: 600, color: task.status === 'completed' ? '#8dc63f' : task.status === 'in_progress' ? 'var(--teal)' : '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Status dropdown for precise control */}
                        <select
                          value={task.status}
                          onChange={e => updateTaskStatus(task.id, e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-sans)', color: '#5a5a5a', background: 'var(--paper)', outline: 'none', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button onClick={() => deleteTask(task.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: 14, flexShrink: 0, lineHeight: 1, padding: '4px', borderRadius: 6, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#e05a5a'; e.currentTarget.style.background = '#fff3f3'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#ddd'; e.currentTarget.style.background = 'transparent'; }}
                          title="Delete task"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── SIDEBAR ─── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Mentor card */}
                <div className="stat-card">
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Your Mentor</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>SJ</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Swayam Jadhav</div>
                      <div style={{ fontSize: 12, color: '#8a8a8a' }}>Senior Manager, Nashik</div>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/91XXXXXXXXXX?text=Hi%20Swayam%2C%20I%27d%20like%20to%20book%20a%20mentorship%20call!"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '11px' }}
                  >
                    Book Mentorship Call
                  </a>
                </div>

                {/* Daily session card */}
                <div style={{ background: '#0d0d0d', borderRadius: 20, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,200,0.2) 0%, transparent 70%)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Daily Session</div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 6, lineHeight: 1.3 }}>Live Strategy Session</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.5 }}>Join today's live training at 8:00 PM on Google Meet.</p>
                    <a href="#" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '11px', background: 'var(--teal)' }}>
                      Join Webinar →
                    </a>
                  </div>
                </div>

                {/* Quick links */}
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quick Links</div>
                  {[
                    { label: 'Member Directory', href: '/directory', icon: '👥' },
                    { label: 'Upcoming Events', href: '/events', icon: '📅' },
                    { label: 'Contact Support', href: '/contact', icon: '💬' },
                  ].map((link, i) => (
                    <Link key={i} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--paper)', textDecoration: 'none', color: 'var(--ink)', fontSize: 14, fontWeight: 500, transition: 'background 0.15s' }}>
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>

              </div>
            </div>
          </>
        )}

        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#e05a5a', fontSize: 15 }}>
            {error} — <Link href="/login" style={{ color: 'var(--teal)' }}>Login again</Link>
          </div>
        )}

      </main>
    </div>
  );
}
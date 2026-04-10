'use client';
import Chatbot from '@/app/components/Chatbot';
import AvatarUpload from '@/app/components/AvatarUpload';
import ThemeToggle from '@/app/components/ThemeToggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  user: { id: string; fullName: string; email: string; role: string; joinedAt: string; };
  stats: { totalMembers: number; };
}
interface Task {
  id: string; title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null; created_at: string;
}

const MODULES = [
  { id: 1, title: 'Digital Networking Basics', desc: 'Build your digital presence from scratch.', status: 'completed', progress: 100 },
  { id: 2, title: 'Social Media Optimization', desc: 'Master SMO strategies that convert followers into leads.', status: 'in-progress', progress: 60 },
  { id: 3, title: 'Downline Team Building', desc: 'Learn how to recruit, onboard, and retain your team.', status: 'locked', progress: 0 },
  { id: 4, title: 'Passive Income Frameworks', desc: 'Build systems that earn while you sleep.', status: 'locked', progress: 0 },
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
  const [activeTab, setActiveTab] = useState<'tasks' | 'modules'>('tasks');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tasks').then(r => r.json()).then(d => { if (Array.isArray(d)) setTasks(d); }).catch(() => {});
    fetch('/api/member/avatar').then(r => r.json()).then(d => { if (d.avatar_url) setAvatar(d.avatar_url); }).catch(() => {});
    fetch('/api/dashboard').then(r => r.json()).then(json => {
      if (json.error) { router.push('/login'); return; }
      setData(json); setLoading(false);
    }).catch(() => { setError('Failed to load.'); setLoading(false); });
  }, []);

  const addTask = async () => {
    if (!newTask.trim() || taskLoading) return;
    setTaskLoading(true);
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTask.trim(), due_date: newDueDate || null }) });
      const d = await res.json();
      if (d.success) {
        setTasks(prev => [{ id: d.id, title: newTask.trim(), status: 'pending', due_date: newDueDate || null, created_at: new Date().toISOString() }, ...prev]);
        setNewTask(''); setNewDueDate('');
      }
    } finally { setTaskLoading(false); }
  };

  const cycleStatus = async (id: string, current: string) => {
    const next = current === 'pending' ? 'in_progress' : current === 'in_progress' ? 'completed' : 'pending';
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: next }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next as Task['status'] } : t));
  };

  const setStatus = async (id: string, status: string) => {
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t));
  };

  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const exportData = (format: 'csv' | 'json') => {
    window.open(`/api/member/export?format=${format}`, '_blank');
  };

  const initials = data?.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '..';
  const joinDate = data?.user.joinedAt ? new Date(data.user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const completedMods = MODULES.filter(m => m.status === 'completed').length;
  const trainingPct = Math.round((completedMods / MODULES.length) * 100);
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const doneTasks = tasks.filter(t => t.status === 'completed').length;
  const taskPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <div className="db-root">
      <style>{`
        .db-root {
          min-height: 100vh;
          background: var(--surface-2);
          color: var(--text-primary);
          font-family: var(--font-dm-sans, system-ui, sans-serif);
        }

        /* NAV */
        .db-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          height: 64px;
          display: flex; align-items: center;
          padding: 0 24px;
        }
        .db-nav-inner {
          max-width: 1100px; width: 100%; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .db-nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .db-nav-brand-text {
          font-size: 16px;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          font-family: var(--font-dm-serif, serif);
        }
        .db-nav-actions { display: flex; align-items: center; gap: 8px; }

        /* BUTTONS */
        .db-btn-ghost {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-strong);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center;
          transition: all 0.2s;
        }
        .db-btn-ghost:hover { border-color: var(--teal); color: var(--teal); }
        .db-btn-logout {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-strong);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .db-btn-logout:hover { border-color: #e05a5a; color: #e05a5a; }
        .db-btn-primary {
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 9px 18px;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex; align-items: center;
        }
        .db-btn-primary:hover { filter: brightness(1.1); }
        .db-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        /* CARDS */
        .db-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px 24px;
        }

        /* MAIN */
        .db-main { max-width: 1100px; margin: 0 auto; padding: 36px 24px; }

        /* STATS GRID */
        .db-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .db-stat {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px 24px;
        }
        .db-stat-label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .db-stat-val { font-size: 30px; letter-spacing: -0.02em; margin-bottom: 4px; font-family: var(--font-dm-serif, serif); }
        .db-stat-sub { font-size: 12px; color: var(--text-faint); }

        /* TABS */
        .db-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
        .db-tab {
          padding: 8px 20px; border-radius: 100px;
          border: 1px solid transparent;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          color: var(--text-secondary);
          background: transparent;
          transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .db-tab:hover { background: var(--surface-3); }
        .db-tab.active {
          background: var(--card-bg);
          border-color: var(--border-strong);
          color: var(--text-primary);
          font-weight: 600;
          box-shadow: 0 1px 4px var(--shadow);
        }
        .db-tab-badge {
          background: var(--orange);
          color: white;
          border-radius: 100px;
          padding: 1px 7px;
          font-size: 10px; font-weight: 700;
        }

        /* GRID */
        .db-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

        /* TASK PANEL */
        .db-task-panel {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .db-task-header {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .db-task-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .db-task-sub { font-size: 12px; color: var(--text-faint); }
        .db-task-badge-done { font-size: 11px; font-weight: 700; color: #8dc63f; background: rgba(141,198,63,0.12); border-radius: 100px; padding: 3px 10px; }
        .db-task-badge-pending { font-size: 11px; font-weight: 700; color: var(--orange); background: var(--orange-light); border-radius: 100px; padding: 3px 10px; }

        /* PROGRESS BAR */
        .db-progress-wrap {
          padding: 10px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 12px;
        }
        .db-progress-bg {
          flex: 1; height: 6px;
          background: var(--border-strong);
          border-radius: 3px; overflow: hidden;
        }
        .db-progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

        /* ADD TASK ROW */
        .db-add-row {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .db-input {
          flex: 1; min-width: 180px;
          padding: 9px 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          color: var(--text-primary);
          background: var(--input-bg);
          transition: border-color 0.2s;
        }
        .db-input:focus { border-color: var(--teal); }
        .db-input::placeholder { color: var(--text-faint); }
        .db-date-input {
          padding: 9px 10px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          color: var(--text-secondary);
          background: var(--input-bg);
          transition: border-color 0.2s;
        }
        .db-date-input:focus { border-color: var(--teal); }

        /* TASK ROWS */
        .db-task-group-label {
          padding: 8px 20px 4px;
          font-size: 10px; font-weight: 700;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--surface-3);
        }
        .db-task-row {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .db-task-row:hover { background: var(--surface-3); }
        .db-task-row:last-child { border-bottom: none; }

        /* STATUS CIRCLE */
        .db-status-btn {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 2px solid var(--border-strong);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        /* STATUS SELECT */
        .db-status-select {
          padding: 4px 8px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 11px;
          font-family: inherit;
          color: var(--text-secondary);
          background: var(--surface-3);
          outline: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* DELETE BTN */
        .db-delete-btn {
          background: none; border: none;
          cursor: pointer;
          color: var(--text-faint);
          font-size: 14px;
          padding: 4px 6px;
          border-radius: 6px;
          flex-shrink: 0;
          transition: all 0.15s;
          line-height: 1;
        }
        .db-delete-btn:hover { color: #e05a5a; background: rgba(224,90,90,0.1); }

        /* MODULE ROWS */
        .db-module-row {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .db-module-row.locked { opacity: 0.45; }

        /* SIDEBAR */
        .db-sidebar { display: flex; flex-direction: column; gap: 16px; }

        /* QUICK LINK */
        .db-quick-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: var(--surface-3);
          text-decoration: none;
          color: var(--text-primary);
          font-size: 14px; font-weight: 500;
          margin-bottom: 8px;
          transition: background 0.15s;
          border: 1px solid transparent;
        }
        .db-quick-link:hover { background: var(--surface-2); border-color: var(--border); }

        /* EMPTY STATE */
        .db-empty { text-align: center; padding: 40px 0; color: var(--text-faint); font-size: 13px; }

        /* ERROR */
        .db-error { text-align: center; padding: 80px 0; color: #e05a5a; font-size: 14px; }

        /* LOADING */
        .db-loading { text-align: center; padding: 80px 0; color: var(--text-faint); font-size: 14px; }

        @media (max-width: 768px) {
          .db-grid { grid-template-columns: 1fr !important; }
          .db-stats { grid-template-columns: 1fr 1fr !important; }
          .db-main { padding: 20px 16px !important; }
          .db-nav { padding: 0 16px !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link href="/" className="db-nav-brand">
            <img src="/icon.png" alt="" style={{ height: 32 }} />
            <span className="db-nav-brand-text">Achievers Portal</span>
          </Link>
          <div className="db-nav-actions">
            <Link href="/directory" className="db-btn-ghost">Directory</Link>
            <ThemeToggle />
            <button className="db-btn-logout" onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login'; }}>
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="db-main">
        {loading && <div className="db-loading">Loading your dashboard...</div>}
        {!loading && error && <div className="db-error">{error} — <Link href="/login" style={{ color: 'var(--teal)' }}>Login again</Link></div>}

        {!loading && data && (<>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <AvatarUpload initials={initials} currentAvatar={avatar} onUpdate={setAvatar} size={52} />
              <div>
                <h1 style={{ fontSize: 26, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 3, fontFamily: 'var(--font-dm-serif, serif)', fontWeight: 400 }}>
                  Welcome back, {data.user.fullName.split(' ')[0]}!
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Member since {joinDate} · {data.user.email}</p>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ● {data.user.role}
            </div>
          </div>

          {/* STATS */}
          <div className="db-stats">
            {[
              { label: 'Community', val: `${data.stats.totalMembers}`, sub: 'active members', color: 'var(--teal)' },
              { label: 'Training', val: `${trainingPct}%`, sub: 'curriculum done', color: 'var(--orange)' },
              { label: 'My Tasks', val: `${doneTasks}/${tasks.length}`, sub: 'completed', color: 'var(--lime)' },
              { label: 'Pending', val: `${pendingTasks}`, sub: 'need attention', color: pendingTasks > 0 ? '#e05a5a' : 'var(--text-faint)' },
            ].map((s, i) => (
              <div key={i} className="db-stat" style={{ borderTop: `3px solid ${s.color}` }}>
                <div className="db-stat-label">{s.label}</div>
                <div className="db-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="db-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="db-tabs">
            <button className={`db-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              My Tasks {pendingTasks > 0 && <span className="db-tab-badge">{pendingTasks}</span>}
            </button>
            <button className={`db-tab ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')}>
              Training Modules
            </button>
          </div>

          <div className="db-grid">

            {/* ─── LEFT ─── */}
            <div>

              {/* TASKS */}
              {activeTab === 'tasks' && (
                <div className="db-task-panel">
                  <div className="db-task-header">
                    <div>
                      <div className="db-task-title">My Tasks</div>
                      <div className="db-task-sub">Your tasks + tasks assigned by your mentor</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {doneTasks > 0 && <span className="db-task-badge-done">{doneTasks} done</span>}
                      {pendingTasks > 0 && <span className="db-task-badge-pending">{pendingTasks} pending</span>}
                    </div>
                  </div>

                  {tasks.length > 0 && (
                    <div className="db-progress-wrap">
                      <div className="db-progress-bg">
                        <div className="db-progress-fill" style={{ width: `${taskPct}%`, background: 'linear-gradient(90deg, var(--teal), var(--lime))' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>{taskPct}%</span>
                    </div>
                  )}

                  <div className="db-add-row">
                    <input className="db-input" value={newTask} onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a new task and press Enter..." />
                    <input type="date" className="db-date-input" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
                    <button className="db-btn-primary" onClick={addTask} disabled={taskLoading || !newTask.trim()}>+ Add</button>
                  </div>

                  <div>
                    {tasks.length === 0 && <div className="db-empty">No tasks yet — add one above or wait for your mentor to assign one</div>}

                    {(['pending', 'in_progress', 'completed'] as const).map(group => {
                      const groupTasks = tasks.filter(t => t.status === group);
                      if (!groupTasks.length) return null;
                      return (
                        <div key={group}>
                          <div className="db-task-group-label">
                            {group === 'in_progress' ? 'In Progress' : group.charAt(0).toUpperCase() + group.slice(1)} ({groupTasks.length})
                          </div>
                          {groupTasks.map(task => {
                            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                            return (
                              <div key={task.id} className="db-task-row">
                                <button className="db-status-btn" onClick={() => cycleStatus(task.id, task.status)}
                                  style={{
                                    borderColor: task.status === 'completed' ? 'var(--lime)' : task.status === 'in_progress' ? 'var(--teal)' : 'var(--border-strong)',
                                    background: task.status === 'completed' ? 'var(--lime)' : task.status === 'in_progress' ? 'var(--teal-light)' : 'transparent'
                                  }}>
                                  {task.status === 'completed' && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                  )}
                                  {task.status === 'in_progress' && (
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />
                                  )}
                                </button>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 14, fontWeight: 500, color: task.status === 'completed' ? 'var(--text-faint)' : 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none', lineHeight: 1.4 }}>
                                    {task.title}
                                  </div>
                                  {task.due_date && (
                                    <div style={{ fontSize: 11, marginTop: 3, color: isOverdue ? '#e05a5a' : 'var(--text-faint)', fontWeight: isOverdue ? 700 : 400 }}>
                                      {isOverdue ? '⚠ Overdue · ' : ''}Due {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </div>
                                  )}
                                </div>

                                <select className="db-status-select" value={task.status} onChange={e => setStatus(task.id, e.target.value)}>
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>

                                <button className="db-delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODULES */}
              {activeTab === 'modules' && (
                <div>
                  <div className="db-card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>Overall</span>
                    <div className="db-progress-bg">
                      <div className="db-progress-fill" style={{ width: `${trainingPct}%`, background: 'linear-gradient(90deg, var(--teal), var(--lime))' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>{trainingPct}%</span>
                  </div>

                  {MODULES.map(mod => (
                    <div key={mod.id} className={`db-module-row ${mod.status === 'locked' ? 'locked' : ''}`}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: mod.status === 'locked' ? 'var(--surface-3)' : mod.status === 'completed' ? 'rgba(141,198,63,0.12)' : 'var(--teal-light)' }}>
                        {mod.status === 'completed' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        {mod.status === 'in-progress' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                        {mod.status === 'locked' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: mod.status === 'locked' ? 'var(--text-faint)' : 'var(--text-primary)', marginBottom: 3 }}>{mod.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{mod.desc}</div>
                        {mod.status === 'in-progress' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                            <div className="db-progress-bg" style={{ maxWidth: 140 }}>
                              <div className="db-progress-fill" style={{ width: `${mod.progress}%`, background: 'var(--teal)' }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>{mod.progress}%</span>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
                        background: mod.status === 'completed' ? 'rgba(141,198,63,0.12)' : mod.status === 'in-progress' ? 'var(--teal-light)' : 'var(--surface-3)',
                        color: mod.status === 'completed' ? 'var(--lime)' : mod.status === 'in-progress' ? 'var(--teal)' : 'var(--text-faint)' }}>
                        {mod.status === 'in-progress' ? 'In Progress' : mod.status.charAt(0).toUpperCase() + mod.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── SIDEBAR ─── */}
            <div className="db-sidebar">

              {/* Mentor */}
              <div className="db-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Your Mentor</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>SJ</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Swayam Jadhav</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Senior Manager, Nashik</div>
                  </div>
                </div>
                <a href="https://wa.me/9146531857?text=Hi%20Swayam%2C%20I%27d%20like%20to%20book%20a%20mentorship%20call!" target="_blank" rel="noopener noreferrer" className="db-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                  Book Mentorship Call
                </a>
              </div>

              {/* Daily Session */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,200,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Daily Session</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Live Strategy Session</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.5 }}>Join today's live training at 8:00 PM on Google Meet.</p>
                  <Link href="/events" className="db-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', background: 'var(--teal)', textDecoration: 'none' }}>View Events →</Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="db-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Quick Links</div>
                {[['👥', 'Member Directory', '/directory'], ['📅', 'Upcoming Events', '/events'], ['💬', 'Contact Support', '/contact']].map(([icon, label, href]) => (
                  <Link key={href} href={href} className="db-quick-link"><span>{icon}</span>{label}</Link>
                ))}
              </div>

              {/* Export Data */}
              <div className="db-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Export My Data</div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>Download your profile and task history.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => exportData('csv')}
                    style={{ flex: 1, padding: '9px 0', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--surface-3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    CSV
                  </button>
                  <button onClick={() => exportData('json')}
                    style={{ flex: 1, padding: '9px 0', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--surface-3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    JSON
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>)}
      </main>

      <Chatbot />
    </div>
  );
}
'use client';
import Chatbot from '@/app/components/Chatbot';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// At top with imports:
import ThemeToggle from '@/app/components/ThemeToggle';

// In the nav, between Directory button and Log out button:


interface DashboardData {
  user: { id: string; fullName: string; email: string; role: string; joinedAt: string; };
  stats: { totalMembers: number; };
}
interface Task {
  id: string; title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null; created_at: string;
  assigned_by?: string;
}

const MODULES = [
  { id: 1, title: 'Digital Networking Basics', desc: 'Build your professional digital presence from scratch.', status: 'completed', progress: 100 },
  { id: 2, title: 'Social Media Optimization (SMO)', desc: 'Master SMO strategies that convert followers into leads.', status: 'in-progress', progress: 60 },
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
  const [activeTab, setActiveTab] = useState<'modules' | 'tasks'>('tasks');

  useEffect(() => {
    fetch('/api/tasks').then(r => r.json()).then(d => { if (Array.isArray(d)) setTasks(d); }).catch(() => {});
    fetch('/api/dashboard').then(res => res.json()).then(json => {
      if (json.error) { setError(json.error); router.push('/login'); }
      else setData(json);
      setLoading(false);
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

  const updateTaskStatus = async (id: string, status: string) => {
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t));
  };

  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const initials = data?.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '..';
  const joinDate = data?.user.joinedAt ? new Date(data.user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const completedModules = MODULES.filter(m => m.status === 'completed').length;
  const overallProgress = Math.round((completedModules / MODULES.length) * 100);
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const doneTasks = tasks.filter(t => t.status === 'completed').length;
  const taskProgress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        :root { --teal:#00aac8; --teal-light:#e0f6fb; --orange:#f5821f; --orange-light:#fef3e8; --lime:#8dc63f; --ink:#0d0d0d; --paper:#f8f7f4; --paper-warm:#f2f0ec; }
        * { box-sizing:border-box; margin:0; padding:0; }
        .serif { font-family:var(--font-serif); }
        .nav-bar { background:rgba(255,255,255,0.85); backdrop-filter:blur(24px); border-bottom:1px solid rgba(0,0,0,0.06); padding:0 24px; position:sticky; top:0; z-index:50; }
        .nav-inner { max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:64px; }
        .stat-card { background:white; border:1px solid rgba(0,0,0,0.06); border-radius:20px; padding:20px 24px; }
        .btn-primary { background:var(--orange); color:white; border:none; border-radius:100px; padding:10px 24px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
        .btn-primary:hover { background:#e07018; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-ghost { background:transparent; color:var(--ink); border:1px solid rgba(0,0,0,0.15); border-radius:100px; padding:8px 18px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
        .btn-ghost:hover { border-color:var(--teal); color:var(--teal); }
        .logout-btn { background:transparent; border:1px solid rgba(0,0,0,0.12); border-radius:100px; padding:8px 18px; font-size:13px; font-weight:500; color:#7a7a7a; cursor:pointer; transition:all 0.2s; }
        .logout-btn:hover { border-color:#e05a5a; color:#e05a5a; }
        .tab-btn { padding:8px 20px; border-radius:100px; border:1px solid transparent; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; color:#5a5a5a; background:transparent; }
        .tab-btn:hover { background:var(--paper-warm); }
        .tab-btn.active { background:white; border-color:rgba(0,0,0,0.1); color:var(--ink); font-weight:600; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
        .progress-bar-bg { height:6px; background:rgba(0,0,0,0.07); border-radius:3px; overflow:hidden; flex:1; }
        .progress-bar-fill { height:100%; border-radius:3px; transition:width 0.6s ease; }
        .module-row { background:white; border:1px solid rgba(0,0,0,0.06); border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px; transition:all 0.2s; }
        .module-row.locked { opacity:0.5; }
        .task-row { display:flex; align-items:center; gap:12px; padding:14px 20px; border-bottom:1px solid rgba(0,0,0,0.04); transition:background 0.15s; }
        .task-row:hover { background:var(--paper); }
        .task-row:last-child { border-bottom:none; }
        .status-circle { width:24px; height:24px; border-radius:50%; border:2px solid rgba(0,0,0,0.2); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
        select.task-status { padding:4px 8px; border:1px solid rgba(0,0,0,0.08); border-radius:8px; font-size:11px; font-family:var(--font-sans); color:#5a5a5a; background:var(--paper); outline:none; cursor:pointer; flex-shrink:0; }
        @media (max-width:768px) { .dashboard-grid { grid-template-columns:1fr !important; } .stats-grid { grid-template-columns:1fr 1fr !important; } .nav-bar { padding:0 16px !important; } main { padding:20px 16px !important; } }
      `}</style>

      {/* NAV */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <img src="/icon.png" alt="" style={{ height:32 }} />
            <span className="serif" style={{ fontSize:16, color:'#0d0d0d', letterSpacing:'-0.01em' }}>Achievers Portal</span>
          </Link>
          <div style={{ display:'flex', gap:8 }}>
            <Link href="/directory" className="btn-ghost">Directory</Link>
            <ThemeToggle />
            <button className="logout-btn" onClick={async () => { await fetch('/api/logout', { method:'POST' }); window.location.href='/login'; }}>Log out</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:1100, margin:'0 auto', padding:'36px 24px' }}>
        {loading && <div style={{ textAlign:'center', padding:'80px 0', color:'#aaa', fontSize:14 }}>Loading your dashboard...</div>}

        {!loading && data && (<>

          {/* HEADER */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg, var(--teal), var(--lime))', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:18, flexShrink:0 }}>{initials}</div>
              <div>
                <h1 className="serif" style={{ fontSize:26, letterSpacing:'-0.02em', color:'#0d0d0d', marginBottom:3 }}>Welcome back, {data.user.fullName.split(' ')[0]}!</h1>
                <p style={{ fontSize:13, color:'#8a8a8a' }}>Member since {joinDate} · {data.user.email}</p>
              </div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--teal-light)', color:'var(--teal)', borderRadius:100, padding:'6px 16px', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>
              ● {data.user.role}
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:28 }}>
            {[
              { label:'Community', val:`${data.stats.totalMembers}`, sub:'active members', color:'var(--teal)' },
              { label:'Training', val:`${overallProgress}%`, sub:'curriculum done', color:'var(--orange)' },
              { label:'My Tasks', val:`${doneTasks}/${tasks.length}`, sub:'completed', color:'#8dc63f' },
              { label:'Pending Tasks', val:`${pendingTasks}`, sub:'need attention', color: pendingTasks > 0 ? '#e05a5a' : '#aaa' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>{s.label}</div>
                <div className="serif" style={{ fontSize:30, letterSpacing:'-0.02em', color:s.color, marginBottom:4 }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#aaa' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display:'flex', gap:6, marginBottom:20 }}>
            <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              My Tasks {pendingTasks > 0 && <span style={{ background:'var(--orange)', color:'white', borderRadius:100, padding:'1px 7px', fontSize:10, fontWeight:700 }}>{pendingTasks}</span>}
            </button>
            <button className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')}>Training Modules</button>
          </div>

          <div className="dashboard-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>

            {/* LEFT PANEL */}
            <div>

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div style={{ background:'white', border:'1px solid rgba(0,0,0,0.06)', borderRadius:20, overflow:'hidden' }}>
                  {/* Header */}
                  <div style={{ padding:'18px 20px', borderBottom:'1px solid rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#0d0d0d', marginBottom:2 }}>My Tasks</div>
                      <div style={{ fontSize:12, color:'#aaa' }}>Your tasks + tasks assigned by your mentor</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      {doneTasks > 0 && <span style={{ fontSize:11, fontWeight:700, color:'#8dc63f', background:'#f2f9e6', borderRadius:100, padding:'3px 10px' }}>{doneTasks} done</span>}
                      {pendingTasks > 0 && <span style={{ fontSize:11, fontWeight:700, color:'var(--orange)', background:'var(--orange-light)', borderRadius:100, padding:'3px 10px' }}>{pendingTasks} pending</span>}
                    </div>
                  </div>

                  {/* Task progress bar */}
                  {tasks.length > 0 && (
                    <div style={{ padding:'10px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)', display:'flex', alignItems:'center', gap:12 }}>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width:`${taskProgress}%`, background:'linear-gradient(90deg, var(--teal), #8dc63f)' }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--teal)', flexShrink:0 }}>{taskProgress}%</span>
                    </div>
                  )}

                  {/* Add task */}
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(0,0,0,0.05)', display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
                      placeholder="Add a new task and press Enter..."
                      style={{ flex:1, minWidth:180, padding:'9px 14px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:10, fontSize:13, fontFamily:'var(--font-sans)', outline:'none', color:'var(--ink)' }} />
                    <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                      style={{ padding:'9px 10px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:10, fontSize:13, fontFamily:'var(--font-sans)', outline:'none', color:'#5a5a5a' }} />
                    <button onClick={addTask} disabled={taskLoading || !newTask.trim()} className="btn-primary" style={{ padding:'9px 16px', fontSize:13 }}>+ Add</button>
                  </div>

                  {/* Task list */}
                  <div>
                    {tasks.length === 0 && (
                      <div style={{ textAlign:'center', padding:'40px 0', color:'#aaa', fontSize:13 }}>
                        No tasks yet — add one above or wait for your mentor to assign one
                      </div>
                    )}

                    {/* Pending & In Progress first */}
                    {['pending', 'in_progress', 'completed'].map(statusGroup => {
                      const groupTasks = tasks.filter(t => t.status === statusGroup);
                      if (groupTasks.length === 0) return null;
                      return (
                        <div key={statusGroup}>
                          <div style={{ padding:'8px 20px 4px', fontSize:10, fontWeight:700, color:'#bbb', textTransform:'uppercase', letterSpacing:'0.08em', background:'var(--paper)' }}>
                            {statusGroup === 'in_progress' ? 'In Progress' : statusGroup.charAt(0).toUpperCase() + statusGroup.slice(1)} ({groupTasks.length})
                          </div>
                          {groupTasks.map(task => {
                            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                            return (
                              <div key={task.id} className="task-row">
                                {/* Click to cycle status */}
                                <button
                                  className="status-circle"
                                  onClick={() => updateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'pending')}
                                  style={{ borderColor: task.status === 'completed' ? '#8dc63f' : task.status === 'in_progress' ? 'var(--teal)' : 'rgba(0,0,0,0.2)', background: task.status === 'completed' ? '#8dc63f' : task.status === 'in_progress' ? 'var(--teal-light)' : 'transparent' }}
                                  title="Click to update status"
                                >
                                  {task.status === 'completed' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                                  {task.status === 'in_progress' && <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--teal)' }} />}
                                </button>

                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontSize:14, fontWeight:500, color: task.status === 'completed' ? '#aaa' : '#0d0d0d', textDecoration: task.status === 'completed' ? 'line-through' : 'none', lineHeight:1.4 }}>
                                    {task.title}
                                  </div>
                                  <div style={{ display:'flex', gap:8, marginTop:3, flexWrap:'wrap', alignItems:'center' }}>
                                    {task.due_date && (
                                      <span style={{ fontSize:11, color: isOverdue ? '#e05a5a' : '#aaa', fontWeight: isOverdue ? 700 : 400 }}>
                                        {isOverdue ? '⚠ Overdue · ' : ''}Due {new Date(task.due_date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Status dropdown */}
                                <select className="task-status" value={task.status} onChange={e => updateTaskStatus(task.id, e.target.value)}>
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>

                                <button onClick={() => deleteTask(task.id)}
                                  style={{ background:'none', border:'none', cursor:'pointer', color:'#ddd', fontSize:14, flexShrink:0, padding:'4px 6px', borderRadius:6, transition:'all 0.15s' }}
                                  onMouseEnter={e => { e.currentTarget.style.color='#e05a5a'; e.currentTarget.style.background='#fff3f3'; }}
                                  onMouseLeave={e => { e.currentTarget.style.color='#ddd'; e.currentTarget.style.background='transparent'; }}
                                >✕</button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODULES TAB */}
              {activeTab === 'modules' && (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {/* Overall progress */}
                  <div className="stat-card" style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#5a5a5a', flexShrink:0 }}>Overall</div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width:`${overallProgress}%`, background:'linear-gradient(90deg, var(--teal), var(--lime))' }} />
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--teal)', flexShrink:0 }}>{overallProgress}%</div>
                  </div>

                  {MODULES.map(mod => (
                    <div key={mod.id} className={`module-row ${mod.status === 'locked' ? 'locked' : ''}`}>
                      <div style={{ width:36, height:36, borderRadius:10, background: mod.status === 'locked' ? '#f0f0f0' : mod.status === 'completed' ? '#f2f9e6' : 'var(--teal-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {mod.status === 'completed' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        {mod.status === 'in-progress' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                        {mod.status === 'locked' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:600, color: mod.status === 'locked' ? '#aaa' : '#0d0d0d', marginBottom:3 }}>{mod.title}</div>
                        <div style={{ fontSize:12, color:'#aaa', lineHeight:1.4 }}>{mod.desc}</div>
                        {mod.status === 'in-progress' && (
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                            <div className="progress-bar-bg" style={{ maxWidth:140 }}>
                              <div className="progress-bar-fill" style={{ width:`${mod.progress}%`, background:'var(--teal)' }} />
                            </div>
                            <span style={{ fontSize:11, color:'var(--teal)', fontWeight:600 }}>{mod.progress}%</span>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:100, textTransform:'uppercase', letterSpacing:'0.05em', flexShrink:0,
                        background: mod.status === 'completed' ? '#f2f9e6' : mod.status === 'in-progress' ? 'var(--teal-light)' : '#f5f5f5',
                        color: mod.status === 'completed' ? '#8dc63f' : mod.status === 'in-progress' ? 'var(--teal)' : '#bbb'
                      }}>
                        {mod.status === 'in-progress' ? 'In Progress' : mod.status.charAt(0).toUpperCase() + mod.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Mentor card */}
              <div className="stat-card">
                <div style={{ fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:14 }}>Your Mentor</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg, var(--teal), var(--lime))', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:15 }}>SJ</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#0d0d0d' }}>Swayam Jadhav</div>
                    <div style={{ fontSize:12, color:'#8a8a8a' }}>Senior Manager, Nashik</div>
                  </div>
                </div>
                <a href="https://wa.me/9146531857?text=Hi%20Swayam%2C%20I%27d%20like%20to%20book%20a%20mentorship%20call!" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:13, padding:'10px' }}>
                  Book Mentorship Call
                </a>
              </div>

              {/* Daily session */}
              <div style={{ background:'#0d0d0d', borderRadius:20, padding:'22px 24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,170,200,0.2) 0%, transparent 70%)' }} />
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--teal)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Daily Session</div>
                  <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:6 }}>Live Strategy Session</h3>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:18, lineHeight:1.5 }}>Join today's live training at 8:00 PM on Google Meet.</p>
                  <Link href="/events" className="btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:13, padding:'10px', background:'var(--teal)' }}>View Events →</Link>
                </div>
              </div>

              {/* Quick links */}
              <div className="stat-card">
                <div style={{ fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Quick Links</div>
                {[['👥', 'Member Directory', '/directory'], ['📅', 'Upcoming Events', '/events'], ['💬', 'Contact Support', '/contact']].map(([icon, label, href]) => (
                  <Link key={href} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'var(--paper)', textDecoration:'none', color:'var(--ink)', fontSize:14, fontWeight:500, marginBottom:8, transition:'background 0.15s' }}>
                    <span>{icon}</span>{label}
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </>)}

        {!loading && error && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#e05a5a', fontSize:14 }}>
            {error} — <Link href="/login" style={{ color:'var(--teal)' }}>Login again</Link>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  );
}
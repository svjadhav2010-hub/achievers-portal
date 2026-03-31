'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Member { id: string; fullName: string; email: string; role: string; referred_by: string | null; created_at: string; }
interface Task { id: string; title: string; status: string; due_date: string | null; created_at: string; fullName: string; email: string; }
interface Application { id: string; fullName: string; email: string; startup_name: string | null; has_pan_card: number; created_at: string; }
interface Stats { total: number; pending: number; rejected: number; tasks_done: number; tasks_total: number; }

type Tab = 'overview' | 'hierarchy' | 'tasks' | 'applications';

function buildTree(members: Member[]) {
  const map: Record<string, Member & { children: any[] }> = {};
  const roots: any[] = [];
  members.forEach(m => { map[m.id] = { ...m, children: [] }; });
  members.forEach(m => {
    if (m.referred_by && map[m.referred_by]) map[m.referred_by].children.push(map[m.id]);
    else roots.push(map[m.id]);
  });
  return roots;
}

function TreeNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const colors = ['var(--teal)', 'var(--orange)', '#8dc63f', '#a78bfa'];
  const color = colors[depth % colors.length];
  const bgs = ['var(--teal-light)', 'var(--orange-light)', '#f2f9e6', '#f3f0ff'];
  const bg = bgs[depth % bgs.length];

  return (
    <div style={{ marginLeft: depth > 0 ? 28 : 0 }}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 14, cursor: hasChildren ? 'pointer' : 'default', background: 'white', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 8, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
      >
        <div style={{ width: 22, height: 22, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color, flexShrink: 0, fontWeight: 700 }}>
          {hasChildren ? (open ? '▾' : '▸') : '·'}
        </div>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: bg, border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
          {node.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d', lineHeight: 1.3 }}>{node.fullName}</div>
          <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 1 }}>{node.email}</div>
        </div>
        {hasChildren && (
          <div style={{ fontSize: 11, fontWeight: 700, color, background: bg, borderRadius: 100, padding: '3px 10px', flexShrink: 0 }}>
            {node.children.length} direct
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, color: node.role === 'ADMIN' ? 'var(--orange)' : 'var(--teal)', background: node.role === 'ADMIN' ? 'var(--orange-light)' : 'var(--teal-light)', borderRadius: 100, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
          {node.role}
        </div>
      </div>
      {open && hasChildren && (
        <div style={{ borderLeft: `2px solid ${color}33`, marginLeft: 10, paddingLeft: 8, marginBottom: 4 }}>
          {node.children.map((child: any) => <TreeNode key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function CEOCommandCenter() {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [assignTask, setAssignTask] = useState({ userId: '', title: '', due_date: '' });
  const [assignLoading, setAssignLoading] = useState(false);
  const [referrers, setReferrers] = useState<{id:string;fullName:string;role:string}[]>([]);
  const [approveReferrer, setApproveReferrer] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/public/members').then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setReferrers(d); }).catch(()=>{});
    fetch('/api/admin/overview')
      .then(r => r.json())
      .then(d => {
        setStats(d.stats);
        setMembers(d.members || []);
        setTasks(d.tasks || []);
        setApplications(d.applications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (userId: string, action: 'APPROVE' | 'APPROVE_AS_MENTOR' | 'REJECT') => {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action, referredBy: approveReferrer[userId] || null }),
    });
    if (res.ok) {
      setApplications(prev => prev.filter(a => a.id !== userId));
      setStats(prev => prev ? {
        ...prev,
        pending: prev.pending - 1,
        total: action === 'APPROVE' ? prev.total + 1 : prev.total,
        rejected: action === 'REJECT' ? prev.rejected + 1 : prev.rejected,
      } : prev);
    }
  };

  const handleAssignTask = async () => {
    if (!assignTask.userId || !assignTask.title.trim()) return;
    setAssignLoading(true);
    const res = await fetch('/api/admin/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignTask),
    });
    const d = await res.json();
    if (d.success) {
      const member = members.find(m => m.id === assignTask.userId);
      setTasks(prev => [{ id: d.id, title: assignTask.title, status: 'pending', due_date: assignTask.due_date || null, created_at: new Date().toISOString(), fullName: member?.fullName || '', email: member?.email || '' }, ...prev]);
      setAssignTask({ userId: '', title: '', due_date: '' });
    }
    setAssignLoading(false);
  };

  const tree = buildTree(members);
  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter(t => t.status === taskFilter);
  const taskPct = stats ? Math.round((stats.tasks_done / Math.max(stats.tasks_total, 1)) * 100) : 0;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'hierarchy', label: 'Hierarchy Tree' },
    { id: 'tasks', label: 'Task Monitor' },
    { id: 'applications', label: 'Applications' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--font-sans)', color: '#0d0d0d' }}>
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
          padding: 0 32px;
          position: sticky; top: 0; z-index: 50;
        }
        .nav-inner {
          max-width: 1300px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }

        .tab-btn {
          padding: 8px 18px; border-radius: 100px;
          border: 1px solid transparent;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          color: #5a5a5a; background: transparent;
        }
        .tab-btn:hover { color: var(--ink); background: var(--paper-warm); }
        .tab-btn.active { color: var(--ink); background: white; border-color: rgba(0,0,0,0.1); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

        .card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
        }
        .section-divider { width: 48px; height: 3px; background: linear-gradient(90deg, var(--teal), var(--lime)); border-radius: 2px; margin-bottom: 16px; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--teal-light); color: var(--teal); border: 1px solid rgba(0,170,200,0.2); border-radius: 100px; padding: 5px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .badge-orange { background: var(--orange-light); color: var(--orange); border-color: rgba(245,130,31,0.2); }

        .btn-primary { background: var(--orange); color: white; border: none; border-radius: 100px; padding: 10px 24px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #e07018; transform: scale(1.02); }
        .btn-ghost { background: transparent; color: var(--ink); border: 1px solid rgba(0,0,0,0.15); border-radius: 100px; padding: 10px 22px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        .approve-btn { background: var(--teal-light); color: var(--teal); border: 1px solid rgba(0,170,200,0.25); border-radius: 10px; padding: 8px 18px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .approve-btn:hover { background: var(--teal); color: white; }
        .reject-btn { background: #fff3f3; color: #e05a5a; border: 1px solid rgba(224,90,90,0.2); border-radius: 10px; padding: 8px 18px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .reject-btn:hover { background: #e05a5a; color: white; }
        .mentor-btn { background: #f3f0ff; color: #7c3aed; border: 1px solid rgba(124,58,237,0.2); border-radius: 10px; padding: 8px 18px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .mentor-btn:hover { background: #7c3aed; color: white; }

        .filter-chip { padding: 6px 16px; border-radius: 100px; border: 1px solid rgba(0,0,0,0.1); background: transparent; font-size: 12px; font-weight: 500; color: #5a5a5a; cursor: pointer; transition: all 0.2s; }
        .filter-chip:hover { border-color: var(--teal); color: var(--teal); }
        .filter-chip.active { background: #0d0d0d; color: white; border-color: #0d0d0d; font-weight: 600; }

        .hr-gradient { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent); margin: 32px 0; }

        tr:hover td { background: var(--paper) !important; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/icon.png" alt="" style={{ height: 32 }} />
            </Link>
            <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.01em' }}>CEO Command Center</div>
              <div style={{ fontSize: 11, color: '#8a8a8a', marginTop: 1 }}>Nashik Branch · Admin</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
                {t.id === 'applications' && applications.length > 0 && (
                  <span style={{ marginLeft: 6, background: 'var(--orange)', color: 'white', borderRadius: 100, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{applications.length}</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
              Live
            </div>
            <button className="btn-ghost" style={{ padding: '7px 18px', fontSize: 12 }}
              onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login'; }}>
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 32px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#aaa', fontSize: 15 }}>
            Loading Command Center...
          </div>
        )}

        {!loading && (
          <>
            {/* ─── OVERVIEW ─── */}
            {tab === 'overview' && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Active Members', val: stats.total, color: 'var(--teal)', bg: 'var(--teal-light)', sub: 'Approved & onboarded' },
                    { label: 'Pending Review', val: stats.pending, color: 'var(--orange)', bg: 'var(--orange-light)', sub: 'Awaiting approval' },
                    { label: 'Rejected', val: stats.rejected, color: '#e05a5a', bg: '#fff3f3', sub: 'Declined applications' },
                    { label: 'Tasks Done', val: stats.tasks_done, color: '#8dc63f', bg: '#f2f9e6', sub: `of ${stats.tasks_total} total` },
                    { label: 'Completion Rate', val: `${taskPct}%`, color: '#7c3aed', bg: '#f3f0ff', sub: 'Branch productivity' },
                  ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: '24px 28px', borderTop: `3px solid ${s.color}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{s.label}</div>
                      <div className="serif" style={{ fontSize: 40, letterSpacing: '-0.03em', color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Productivity bar */}
                <div className="card" style={{ padding: '28px 32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Branch Productivity</div>
                      <div style={{ fontSize: 13, color: '#8a8a8a' }}>Task completion rate across all members</div>
                    </div>
                    <div className="serif" style={{ fontSize: 36, color: '#8dc63f', letterSpacing: '-0.03em' }}>{taskPct}%</div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${taskPct}%`, background: 'linear-gradient(90deg, var(--teal), #8dc63f)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#aaa' }}>
                    <span>{stats.tasks_done} completed</span>
                    <span>{stats.tasks_total - stats.tasks_done} remaining</span>
                  </div>
                </div>

                {/* Recent activity + pending */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="card" style={{ padding: '24px 28px' }}>
                    <div className="section-divider" />
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Recent Task Activity</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {tasks.slice(0, 5).map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.status === 'completed' ? '#8dc63f' : t.status === 'in_progress' ? 'var(--teal)' : '#ddd', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#0d0d0d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                            <div style={{ fontSize: 11, color: '#8a8a8a', marginTop: 1 }}>{t.fullName}</div>
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: t.status === 'completed' ? '#8dc63f' : t.status === 'in_progress' ? 'var(--teal)' : '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                            {t.status.replace('_', ' ')}
                          </div>
                        </div>
                      ))}
                      {tasks.length === 0 && <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No tasks yet</div>}
                    </div>
                    <button onClick={() => setTab('tasks')} style={{ marginTop: 16, fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all tasks →</button>
                  </div>

                  <div className="card" style={{ padding: '24px 28px' }}>
                    <div className="section-divider" style={{ background: 'linear-gradient(90deg, var(--orange), #f5821f88)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>Pending Applications</div>
                      {applications.length > 0 && <span className="badge badge-orange">{applications.length} new</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {applications.slice(0, 4).map(app => (
                        <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--orange-light)', border: '1px solid rgba(245,130,31,0.15)', borderRadius: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {app.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d' }}>{app.fullName}</div>
                            <div style={{ fontSize: 11, color: '#8a8a8a' }}>{app.email}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="approve-btn" onClick={() => handleAction(app.id, 'APPROVE')}>✓</button>
                            <button className="reject-btn" onClick={() => handleAction(app.id, 'REJECT')}>✕</button>
                          </div>
                        </div>
                      ))}
                      {applications.length === 0 && <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No pending applications</div>}
                    </div>
                    {applications.length > 4 && <button onClick={() => setTab('applications')} style={{ marginTop: 16, fontSize: 12, color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {applications.length} →</button>}
                  </div>
                </div>
              </div>
            )}

            {/* ─── HIERARCHY ─── */}
            {tab === 'hierarchy' && (
              <div>
                <div style={{ marginBottom: 28 }}>
                  <div className="section-divider" />
                  <div className="badge" style={{ marginBottom: 16 }}>Network Map</div>
                  <h2 className="serif" style={{ fontSize: 36, letterSpacing: '-0.02em', marginBottom: 8 }}>Hierarchy Tree</h2>
                  <p style={{ fontSize: 14, color: '#8a8a8a' }}>{members.length} members mapped · Click any node to expand or collapse</p>
                </div>

                <div className="card" style={{ padding: '28px 24px', maxHeight: '68vh', overflowY: 'auto' }}>
                  {tree.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>
                      No hierarchy data yet — set <code style={{ background: 'var(--paper)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>referred_by</code> on members to build the tree.
                    </div>
                  )}
                  {tree.map(node => <TreeNode key={node.id} node={node} depth={0} />)}
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 20, fontSize: 12, color: '#8a8a8a', flexWrap: 'wrap' }}>
                  {[['var(--teal)', 'Level 1'], ['var(--orange)', 'Level 2'], ['#8dc63f', 'Level 3'], ['#a78bfa', 'Level 4+']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TASKS ─── */}
            {tab === 'tasks' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div className="section-divider" />
                    <div className="badge" style={{ marginBottom: 16 }}>Branch Monitor</div>
                    <h2 className="serif" style={{ fontSize: 36, letterSpacing: '-0.02em', marginBottom: 6 }}>Global Task Monitor</h2>
                    <p style={{ fontSize: 14, color: '#8a8a8a' }}>{tasks.length} tasks across {members.length} members</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['all', 'pending', 'in_progress', 'completed'] as const).map(f => (
                      <button key={f} className={`filter-chip ${taskFilter === f ? 'active' : ''}`} onClick={() => setTaskFilter(f)}>
                        {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assign task panel */}
                <div className="card" style={{ padding: '20px 24px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 2, minWidth: 180 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Assign task to</div>
                    <select value={assignTask.userId} onChange={e => setAssignTask(p => ({...p, userId: e.target.value}))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                      <option value="">Select member...</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.fullName} ({m.role})</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 3, minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Task title</div>
                    <input value={assignTask.title} onChange={e => setAssignTask(p => ({...p, title: e.target.value}))}
                      placeholder="e.g. Post 3 reels this week"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Due date</div>
                    <input type="date" value={assignTask.due_date} onChange={e => setAssignTask(p => ({...p, due_date: e.target.value}))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                  </div>
                  <button className="btn-primary" onClick={handleAssignTask} disabled={assignLoading || !assignTask.userId || !assignTask.title.trim()}
                    style={{ padding: '10px 24px', fontSize: 13, opacity: !assignTask.userId || !assignTask.title.trim() ? 0.5 : 1, flexShrink: 0 }}>
                    {assignLoading ? 'Assigning...' : 'Assign Task'}
                  </button>
                </div>

                <div className="card" style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--paper)' }}>
                        {['Member', 'Task', 'Status', 'Due Date', 'Created'].map(h => (
                          <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d' }}>{t.fullName}</div>
                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{t.email}</div>
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 13, color: '#3a3a3a', maxWidth: 260 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                              padding: '4px 12px', borderRadius: 100,
                              background: t.status === 'completed' ? '#f2f9e6' : t.status === 'in_progress' ? 'var(--teal-light)' : 'var(--paper)',
                              color: t.status === 'completed' ? '#8dc63f' : t.status === 'in_progress' ? 'var(--teal)' : '#aaa',
                              border: `1px solid ${t.status === 'completed' ? '#8dc63f44' : t.status === 'in_progress' ? 'rgba(0,170,200,0.2)' : 'rgba(0,0,0,0.08)'}`,
                            }}>
                              {t.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 12, color: '#8a8a8a' }}>
                            {t.due_date ? new Date(t.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 12, color: '#aaa' }}>
                            {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>No tasks found</div>
                  )}
                </div>
              </div>
            )}

            {/* ─── APPLICATIONS ─── */}
            {tab === 'applications' && (
              <div>
                <div style={{ marginBottom: 28 }}>
                  <div className="section-divider" style={{ background: 'linear-gradient(90deg, var(--orange), #f5821f88)' }} />
                  <div className="badge badge-orange" style={{ marginBottom: 16 }}>Review Queue</div>
                  <h2 className="serif" style={{ fontSize: 36, letterSpacing: '-0.02em', marginBottom: 6 }}>Pending Applications</h2>
                  <p style={{ fontSize: 14, color: '#8a8a8a' }}>{applications.length} applicants awaiting your decision</p>
                </div>

                {applications.length === 0 && (
                  <div className="card" style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#3a3a3a', marginBottom: 8 }}>Queue is clear</div>
                    <div style={{ fontSize: 14, color: '#aaa' }}>All applications have been reviewed.</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {applications.map(app => (
                    <div key={app.id} className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--orange-light)', border: '1.5px solid rgba(245,130,31,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>
                        {app.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#0d0d0d', marginBottom: 3 }}>{app.fullName}</div>
                        <div style={{ fontSize: 13, color: '#8a8a8a', marginBottom: 8 }}>{app.email}</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {app.startup_name && <span style={{ fontSize: 12, color: '#5a5a5a' }}>💡 {app.startup_name}</span>}
                          <span style={{ fontSize: 12, fontWeight: 600, color: app.has_pan_card ? '#8dc63f' : '#e05a5a' }}>
                            {app.has_pan_card ? '✓ PAN Verified' : '✕ No PAN'}
                          </span>
                          <span style={{ fontSize: 12, color: '#aaa' }}>
                            Applied {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, minWidth: 200 }}>
                        <select
                          value={approveReferrer[app.id] || ''}
                          onChange={e => setApproveReferrer(prev => ({ ...prev, [app.id]: e.target.value }))}
                          style={{ padding: '8px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none', color: '#5a5a5a' }}
                        >
                          <option value="">Referred by (optional)</option>
                          {referrers.map(r => <option key={r.id} value={r.id}>{r.fullName} ({r.role})</option>)}
                        </select>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="approve-btn" style={{ padding: '9px 16px', fontSize: 12, flex: 1 }} onClick={() => handleAction(app.id, 'APPROVE')}>✓ Member</button>
                          <button onClick={() => handleAction(app.id, 'APPROVE_AS_MENTOR')} style={{ background: '#f3f0ff', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '9px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flex: 1 }}>⬆ Mentor</button>
                          <button className="reject-btn" style={{ padding: '9px 12px', fontSize: 12 }} onClick={() => handleAction(app.id, 'REJECT')}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '24px 32px', marginTop: 40 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#aaa' }}>
          <span>The Achievers Club · Nashik · CEO Command Center</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
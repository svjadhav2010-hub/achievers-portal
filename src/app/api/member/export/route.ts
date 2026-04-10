import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv'; // csv | json

    // Fetch user profile
    const [userRows]: any = await pool.query(
      `SELECT fullName, email, phone, role, created_at FROM Users WHERE id = ?`,
      [payload.userId]
    );
    const user = (userRows as any[])[0];
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    // Fetch tasks
    const [taskRows]: any = await pool.query(
      `SELECT title, status, due_date, created_at FROM Tasks WHERE user_id = ? ORDER BY created_at DESC`,
      [payload.userId]
    );
    const tasks = taskRows as any[];

    const exportDate = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      const data = {
        exported_at: new Date().toISOString(),
        profile: {
          full_name: user.fullName,
          email: user.email,
          phone: user.phone || null,
          role: user.role,
          member_since: user.created_at,
        },
        tasks: tasks.map(t => ({
          title: t.title,
          status: t.status,
          due_date: t.due_date || null,
          created_at: t.created_at,
        })),
        summary: {
          total_tasks: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          in_progress: tasks.filter(t => t.status === 'in_progress').length,
          pending: tasks.filter(t => t.status === 'pending').length,
        }
      };

      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="achievers-data-${exportDate}.json"`,
        },
      });
    }

    // CSV format
    const lines: string[] = [];

    // Profile section
    lines.push('PROFILE');
    lines.push('Field,Value');
    lines.push(`Full Name,"${user.fullName}"`);
    lines.push(`Email,"${user.email}"`);
    lines.push(`Phone,"${user.phone || 'Not provided'}"`);
    lines.push(`Role,"${user.role}"`);
    lines.push(`Member Since,"${new Date(user.created_at).toLocaleDateString('en-IN')}"`);
    lines.push('');

    // Tasks section
    lines.push('TASKS');
    lines.push('Title,Status,Due Date,Created');
    tasks.forEach(t => {
      const due = t.due_date ? new Date(t.due_date).toLocaleDateString('en-IN') : 'No due date';
      const created = new Date(t.created_at).toLocaleDateString('en-IN');
      lines.push(`"${t.title}","${t.status.replace('_', ' ')}","${due}","${created}"`);
    });
    lines.push('');

    // Summary section
    lines.push('SUMMARY');
    lines.push('Metric,Count');
    lines.push(`Total Tasks,${tasks.length}`);
    lines.push(`Completed,${tasks.filter(t => t.status === 'completed').length}`);
    lines.push(`In Progress,${tasks.filter(t => t.status === 'in_progress').length}`);
    lines.push(`Pending,${tasks.filter(t => t.status === 'pending').length}`);

    const csv = lines.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="achievers-data-${exportDate}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed.' }, { status: 500 });
  }
}
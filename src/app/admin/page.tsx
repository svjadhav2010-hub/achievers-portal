'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 Add this line

// Define the exact shape of the data coming from our TiDB database
interface Application {
  id: string;
  fullName: string;
  email: string;
  startup_name: string | null;
  has_pan_card: number;
  created_at: string;
}

export default function CEODashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch the data from our API route as soon as the dashboard loads
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/admin/applications');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        setApplications(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // 2. NEW: Handle the Approve/Reject button clicks
  const handleAction = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      // Send the command to your TiDB database via our PATCH route
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process application');
      }

      // Instantly remove that user from the screen without reloading the page
      setApplications((prev) => prev.filter((app) => app.id !== userId));
      
      alert(`Success: Applicant has been ${action.toLowerCase()}d.`);

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Top Navigation / Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CEO Command Center</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Nashik Branch Analytics & Approvals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Live Data
          </div>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Log Out
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pending Applications</h2>
            <p className="text-sm text-slate-500 mt-1">Review and approve new members to join your downline.</p>
          </div>
          <div className="text-sm font-bold text-slate-400">
            Total Pending: <span className="text-slate-900">{applications.length}</span>
          </div>
        </div>

        {/* Status Handling: Loading or Error */}
        {isLoading && (
          <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-bold animate-pulse">Loading secure database...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold">
            Error: {error}
          </div>
        )}

        {/* The Data Table */}
        {!isLoading && !error && applications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="px-6 py-4 font-bold text-slate-600">Applicant Name</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Contact Email</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Startup Idea</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Verification</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-1">ID: {app.id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {app.email}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {app.startup_name || <span className="text-slate-400 italic">None provided</span>}
                      </td>
                      <td className="px-6 py-4">
                        {app.has_pan_card ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            ✅ PAN Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                            ❌ Missing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* 3. NEW: onClick handlers added to these buttons */}
                          <button 
                            onClick={() => handleAction(app.id, 'APPROVE')}
                            className="px-4 py-2 bg-slate-900 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          
                          <button 
                            onClick={() => handleAction(app.id, 'REJECT')}
                            className="px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-600 text-sm font-bold rounded-lg transition-colors"
                          >
                            Reject
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200 shadow-sm border-dashed">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-lg font-bold text-slate-900">No pending applications</h3>
            <p className="text-sm text-slate-500 mt-1">Your review queue is currently empty.</p>
          </div>
        )}

      </main>
    </div>
  );
}
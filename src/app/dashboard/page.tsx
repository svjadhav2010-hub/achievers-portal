'use client';
import Link from 'next/link';

export default function MentorshipDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h2 className="font-bold text-xl text-blue-600">Achievers Portal</h2>
          <Link href="/directory" className="text-sm text-gray-600 hover:text-blue-600">
            ← Back to Directory
          </Link>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Achiever Dashboard</h1>
          <p className="text-gray-500">Track your digital entrepreneurship journey.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Training System Modules</h3>
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">1. Digital Networking Basics</p>
                    <p className="text-xs text-green-600">Completed on March 5</p>
                  </div>
                  <span className="text-green-600">✔</span>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-1">
                    <p className="font-semibold text-blue-800">2. Social Media Optimization (SMO)</p>
                    <p className="text-xs text-blue-600">In Progress - 60%</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor/Support Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Mentor</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold">Swayam Jadhav</h4>
                  <p className="text-xs text-gray-500">Senior Manager, Nashik</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Book Mentorship Call
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white">
              <h3 className="font-bold mb-2">Daily Training Session</h3>
              <p className="text-sm text-blue-100 mb-4">Join today's live strategy session at 8:00 PM.</p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-bold">
                Join Webinar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
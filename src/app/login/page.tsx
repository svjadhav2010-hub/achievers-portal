'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'warning' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 🚦 THE TRAFFIC CONTROLLER (RBAC Routing) 🚦
      const userRole = data.user.role;

      if (userRole === 'PENDING') {
        setMessage({ 
          text: 'Your application is still under review by the CEO. Please check back later.', 
          type: 'warning' 
        });
        setIsLoading(false);
        return; // Stop them from going any further
      }

      if (userRole === 'REJECTED') {
        setMessage({ 
          text: 'Your application to join the network was declined.', 
          type: 'error' 
        });
        setIsLoading(false);
        return; 
      }

      // If approved, show success and route them to their specific portal
      setMessage({ text: 'Authentication successful. Routing...', type: 'success' });
      
      setTimeout(() => {
        if (userRole === 'ADMIN') {
          router.push('/admin');
        } else if (userRole === 'MENTOR') {
          router.push('/dashboard'); // Mentors get same portal as members
        } else {
          router.push('/dashboard'); // Standard Members go to the training portal
        }
      }, 800);

    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🦅</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Log in to access your training and downline.</p>
        </div>

        {/* Dynamic Alert Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
            message.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-green-50 text-green-700 border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link href="/register" className="text-orange-500 hover:text-orange-600 font-bold">Apply to Join</Link>
        </div>

      </div>
    </div>
  );
}
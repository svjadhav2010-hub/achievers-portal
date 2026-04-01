'use client'; // This tells Next.js this is an interactive frontend component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  // 1. Manage Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    startupName: '',
    hasPanCard: false,
    referredBy: '',
  });
  const [referrers, setReferrers] = useState<{id: string; fullName: string; role: string}[]>([]);

  // Fetch existing members for referrer dropdown
  useEffect(() => {
    fetch('/api/public/members')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) setReferrers(data);
      })
      .catch(err => console.error('Referrer fetch error:', err));
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2. Handle Input Changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 3. Intercept and Handle the Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Send the data to our Next.js backend API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Add these two lines to see exactly what the server is saying!
      console.log("STATUS CODE:", response.status);
      console.log("SERVER RESPONSE:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // If successful, redirect the user to the login page or a success screen
      router.push('/login?registered=true');
      
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Start Your Application</h2>
          <p className="text-slate-500 mt-2 font-medium">Join the Nashik Branch digital network.</p>
        </div>

        {/* Display backend error messages here */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="Swayam Jadhav"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Create Password</label>
            <input 
              type="password" 
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Startup Name (Optional)</label>
            <input 
              type="text" 
              name="startupName"
              value={formData.startupName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="Enter your business idea"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Referred by (Optional)</label>
            <select
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
            >
              <option value="">Select who referred you...</option>
              {referrers.map(r => (
                <option key={r.id} value={r.id}>
                  {r.fullName} ({r.role === 'ADMIN' ? 'CEO' : r.role === 'MENTOR' ? 'Mentor' : 'Member'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2">
            <input 
              type="checkbox" 
              name="hasPanCard"
              id="hasPanCard"
              required
              checked={formData.hasPanCard}
              onChange={handleChange}
              className="mt-1 w-5 h-5 accent-orange-500 cursor-pointer"
            />
            <label htmlFor="hasPanCard" className="text-sm font-semibold text-slate-600 cursor-pointer leading-tight">
              I confirm I have a valid PAN Card for payment processing.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
          
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already an Achiever? <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold">Log in here</Link>
        </div>

      </div>
    </div>
  );
}
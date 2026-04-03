'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Step = 'form' | 'otp' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '',
    startupName: '', hasPanCard: false, referredBy: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [referrers, setReferrers] = useState<{id: string; fullName: string; role: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    fetch('/api/public/members')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setReferrers(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, fullName: formData.fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP + Register
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { setErrorMessage('Please enter the complete 6-digit OTP.'); return; }
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Verify OTP first
      const verifyRes = await fetch('/api/register/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpString }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'OTP verification failed');

      // Register user
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error || 'Registration failed');

      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setErrorMessage('');
    setOtp(['', '', '', '', '', '']);
    try {
      await fetch('/api/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, fullName: formData.fullName }),
      });
      setResendTimer(60);
    } catch {
      setErrorMessage('Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">

        {/* ─── SUCCESS ─── */}
        {step === 'success' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Application Submitted!</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Your email is verified and your application is under review by the CEO. You'll be notified once approved.
            </p>
            <Link href="/login" className="block w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-center hover:bg-orange-500 transition-colors">
              Go to Login
            </Link>
          </div>
        )}

        {/* ─── OTP STEP ─── */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-2xl font-extrabold text-slate-900">Check your email</h2>
              <p className="text-slate-500 mt-2">We sent a 6-digit code to</p>
              <p className="font-bold text-slate-800 mt-1">{formData.email}</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister}>
              {/* OTP Input */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all"
                    style={{ borderColor: digit ? '#f5821f' : '#e2e8f0', background: digit ? '#fef3e8' : 'white' }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="text-orange-500 font-bold text-sm disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <button
              onClick={() => { setStep('form'); setErrorMessage(''); setOtp(['','','','','','']); }}
              className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600"
            >
              ← Change email or details
            </button>
          </div>
        )}

        {/* ─── FORM STEP ─── */}
        {step === 'form' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Start Your Application</h2>
              <p className="text-slate-500 mt-2 font-medium">Join the Nashik Branch digital network.</p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                <span className="text-xs font-semibold text-slate-700">Your Details</span>
              </div>
              <div className="h-px flex-1 bg-slate-200" />
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-xs font-medium text-slate-400">Verify Email</span>
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="Rahul Sharma" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Create Password *</label>
                <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Startup Name (Optional)</label>
                <input type="text" name="startupName" value={formData.startupName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="Enter your business idea" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Referred by (Optional)</label>
                <select name="referredBy" value={formData.referredBy} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white">
                  <option value="">Select who referred you...</option>
                  {referrers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.role === 'ADMIN' ? 'CEO' : r.role === 'MENTOR' ? 'Mentor' : 'Member'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                <input type="checkbox" name="hasPanCard" id="hasPanCard" required checked={formData.hasPanCard} onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-orange-500 cursor-pointer" />
                <label htmlFor="hasPanCard" className="text-sm font-semibold text-slate-600 cursor-pointer leading-tight">
                  I confirm I have a valid PAN Card for payment processing.
                </label>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200">
                {isLoading ? 'Sending OTP...' : 'Send Verification Code →'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Already an Achiever? <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold">Log in here</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
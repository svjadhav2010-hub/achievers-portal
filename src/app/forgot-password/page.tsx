'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      const next = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${next}`)?.focus();
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
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Please enter the complete 6-digit code.'); return; }
    // Just move to password step — OTP verified at final submission
    setStep('password');
    setError('');
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      if (err.message?.includes('expired') || err.message?.includes('Incorrect')) {
        setStep('otp');
        setOtp(['', '', '', '', '', '']);
      }
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(''); setOtp(['', '', '', '', '', '']);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResendTimer(60);
    } catch { setError('Failed to resend.'); }
  };

  const passwordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: 'Weak', color: '#e05a5a' };
    if (score <= 3) return { score, label: 'Fair', color: '#f5821f' };
    return { score, label: 'Strong', color: '#8dc63f' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-dm-sans, system-ui)' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fp-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; padding: 40px; width: 100%; max-width: 440px; box-shadow: 0 8px 40px var(--shadow); }
        .fp-input { width: 100%; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; font-family: inherit; outline: none; color: var(--text-primary); background: var(--input-bg); transition: border-color 0.2s; }
        .fp-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,170,200,0.1); }
        .fp-input::placeholder { color: var(--text-faint); }
        .fp-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .fp-btn-primary { background: #0d0d0d; color: white; }
        .fp-btn-primary:hover { background: var(--orange); }
        .fp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .fp-error { background: rgba(224,90,90,0.1); color: #e05a5a; border: 1px solid rgba(224,90,90,0.2); border-radius: 10px; padding: 12px 14px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
        .fp-otp-box { width: 48px; height: 56px; text-align: center; font-size: 22px; font-weight: 700; border: 2px solid var(--border); border-radius: 12px; outline: none; color: var(--text-primary); background: var(--input-bg); transition: all 0.2s; }
        .fp-otp-box:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(245,130,31,0.15); }
        .fp-back { background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 24px; padding: 0; transition: color 0.2s; }
        .fp-back:hover { color: var(--text-primary); }
        .fp-step { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
        .fp-step-dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; }
      `}</style>

      <div className="fp-card">

        {/* ─── SUCCESS ─── */}
        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(141,198,63,0.12)', border: '2px solid #8dc63f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Password Reset!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Link href="/login" style={{ display: 'block', background: '#0d0d0d', color: 'white', textAlign: 'center', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}>
              Go to Login →
            </Link>
          </div>
        )}

        {/* ─── EMAIL STEP ─── */}
        {step === 'email' && (
          <>
            <Link href="/login" className="fp-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back to login
            </Link>

            {/* Step indicators */}
            <div className="fp-step">
              {['email', 'otp', 'password'].map((s, i) => (
                <div key={s} className="fp-step-dot" style={{ background: step === s ? 'var(--orange)' : i < ['email','otp','password'].indexOf(step) ? 'var(--lime)' : 'var(--border-strong)', width: step === s ? 24 : 8, borderRadius: step === s ? 4 : '50%' }} />
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 4 12 13 22 4"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Forgot your password?</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>No worries! Enter your registered email and we'll send you a verification code.</p>
            </div>

            {error && <div className="fp-error">{error}</div>}

            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="fp-input" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading || !email} className="fp-btn fp-btn-primary" style={{ marginTop: 8 }}>
                {loading ? 'Sending code...' : 'Send Verification Code →'}
              </button>
            </form>
          </>
        )}

        {/* ─── OTP STEP ─── */}
        {step === 'otp' && (
          <>
            <button className="fp-back" onClick={() => { setStep('email'); setError(''); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Change email
            </button>

            <div className="fp-step">
              {['email', 'otp', 'password'].map((s, i) => (
                <div key={s} className="fp-step-dot" style={{ background: step === s ? 'var(--orange)' : i < ['email','otp','password'].indexOf(step) ? 'var(--lime)' : 'var(--border-strong)', width: step === s ? 24 : 8, borderRadius: step === s ? 4 : '50%' }} />
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                We sent a 6-digit code to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>
            </div>

            {error && <div className="fp-error">{error}</div>}

            <form onSubmit={handleVerifyOTP}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={6}
                    value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="fp-otp-box"
                    style={{ borderColor: digit ? 'var(--orange)' : 'var(--border)', background: digit ? 'var(--orange-light)' : 'var(--input-bg)' }}
                  />
                ))}
              </div>
              <button type="submit" className="fp-btn fp-btn-primary" disabled={otp.join('').length !== 6}>
                Verify Code →
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Didn't receive the code?</p>
              <button onClick={handleResend} disabled={resendTimer > 0}
                style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: resendTimer > 0 ? 'var(--text-faint)' : 'var(--orange)', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer' }}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>
          </>
        )}

        {/* ─── NEW PASSWORD STEP ─── */}
        {step === 'password' && (
          <>
            <button className="fp-back" onClick={() => { setStep('otp'); setError(''); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            <div className="fp-step">
              {['email', 'otp', 'password'].map((s, i) => (
                <div key={s} className="fp-step-dot" style={{ background: 'var(--lime)', width: s === 'password' ? 24 : 8, borderRadius: s === 'password' ? 4 : '50%' }} />
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(141,198,63,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Set new password</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>Choose a strong password for your account.</p>
            </div>

            {error && <div className="fp-error">{error}</div>}

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} required minLength={8}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="fp-input" placeholder="Min. 8 characters" style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 4 }}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {/* Strength indicator */}
                {newPassword && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : 'var(--border-strong)', transition: 'all 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} required
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="fp-input" placeholder="Repeat your password"
                  style={{ borderColor: confirmPassword && confirmPassword !== newPassword ? '#e05a5a' : 'var(--border)' }} />
                {confirmPassword && confirmPassword !== newPassword && (
                  <div style={{ fontSize: 12, color: '#e05a5a', marginTop: 6, fontWeight: 500 }}>Passwords do not match</div>
                )}
              </div>

              <button type="submit" disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="fp-btn fp-btn-primary" style={{ marginTop: 8 }}>
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        {step !== 'success' && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-faint)', marginTop: 24 }}>
            Remember your password? <Link href="/login" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
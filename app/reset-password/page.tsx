'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Supabase automatically handles the token from the URL hash
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      setStatus('error');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => router.push('/dashboard'), 2500);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#dc2626', '#F5A623', '#0A5C36'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
        
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
          <div className="logo-icon" style={{ width: 36, height: 36 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">BizPlan <span>Nigeria</span></span>
        </Link>

        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'var(--color-primary-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-primary)' }}>
              <CheckCircle2 size={36} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '12px' }}>Password Updated!</h1>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Your password has been reset successfully. Redirecting you to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '8px' }}>Create New Password</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              Choose a strong password for your BizPlan Nigeria account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-light)', cursor: 'pointer', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor[strength] : 'var(--color-border)' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: strengthColor[strength], fontWeight: 600 }}>{strengthLabel[strength]}</span>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    style={{ paddingLeft: '40px', borderColor: confirm && confirm !== password ? '#dc2626' : '' }}
                  />
                </div>
                {confirm && confirm !== password && (
                  <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginTop: 4 }}>Passwords do not match</p>
                )}
              </div>

              {status === 'error' && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={status === 'loading' || !password || !confirm}
              >
                {status === 'loading' ? <><Loader2 size={16} className="spinner" /> Updating...</> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

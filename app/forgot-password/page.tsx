'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
        
        {/* Logo */}
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '12px' }}>Check your inbox!</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and click the link.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                onClick={() => setStatus('idle')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                try again
              </button>.
            </p>
            <Link href="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '8px' }}>Reset Password</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              Enter your email address and we&apos;ll send you a secure link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                    autoFocus
                  />
                </div>
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
                disabled={status === 'loading' || !email}
              >
                {status === 'loading' ? <><Loader2 size={16} className="spinner" /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
              Remember your password?{' '}
              <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

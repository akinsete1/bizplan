import { redirect } from 'next/navigation';

export default function ForgotPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '8px' }}>Reset Password</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Enter your email and we&apos;ll send you a reset link.</p>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" placeholder="you@example.com" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Reset Link</button>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
          Remember your password? <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

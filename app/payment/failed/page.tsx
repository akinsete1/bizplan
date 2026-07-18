export default function PaymentFailedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Payment Failed</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '32px', maxWidth: '500px' }}>
        We couldn&apos;t process your payment. Please try again or use a different payment method.
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <a href="javascript:history.back()" className="btn btn-primary btn-lg">
          Try Again
        </a>
        <a href="/dashboard" className="btn btn-outline btn-lg">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

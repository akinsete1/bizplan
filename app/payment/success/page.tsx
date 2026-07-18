export default function PaymentSuccessPage({ searchParams }: { searchParams: { ref?: string } }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Payment Successful!</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '32px', maxWidth: '500px' }}>
        Thank you for your purchase. Your payment was successful and your account has been updated.
      </p>
      {searchParams.ref && (
        <div style={{ background: 'var(--color-bg)', padding: '12px 24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
          Reference: {searchParams.ref}
        </div>
      )}
      <a href="/dashboard" className="btn btn-primary btn-lg">
        Go to Dashboard
      </a>
    </div>
  );
}

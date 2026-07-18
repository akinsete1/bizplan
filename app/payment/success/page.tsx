'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      return;
    }

    // Verify the payment
    fetch('/api/paystack/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [reference, router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      {status === 'verifying' && (
        <>
          <Loader2 size={64} className="spinner" style={{ color: 'var(--color-primary)', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Verifying Payment...</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Please wait while we confirm your transaction securely.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 size={80} color="var(--color-success)" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Payment Successful!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Your account has been updated successfully.</p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={80} color="var(--color-danger)" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Payment Verification Failed</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>We couldn&apos;t verify your payment. If you were debited, please contact support.</p>
          <Link href="/dashboard" className="btn btn-outline btn-lg">Return to Dashboard</Link>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="container section">
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader2 size={48} className="spinner" style={{ color: 'var(--color-primary)' }} /></div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

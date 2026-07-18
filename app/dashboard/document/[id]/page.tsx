'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase, getUserSubscription } from '@/lib/supabase';
import { Document } from '@/lib/database.types';
import { ArrowLeft, Download, Loader2, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './document.module.css';
import { usePaystack } from '@/components/payment/usePaystack';

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const { initializePayment, isReady } = usePaystack();

  useEffect(() => {
    async function fetchDoc() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email || '');
      setUserId(user.id);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        alert('Document not found.');
        router.push('/dashboard');
        return;
      }

      setDoc(data);

      // Check if user needs to pay
      if (!data.is_paid) {
        // Check for active subscription
        const { data: sub } = await getUserSubscription(user.id);
        if (!sub) {
          setIsLocked(true);
        }
      }

      setLoading(false);
    }
    fetchDoc();
  }, [params.id, router]);

  const handleUnlock = () => {
    initializePayment({
      email: userEmail,
      amount: 2500 * 100, // ₦2,500 in kobo
      metadata: {
        user_id: userId,
        document_id: doc?.id,
        plan: 'starter'
      },
      onSuccess: async (response) => {
        setVerifying(true);
        try {
          const res = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference }),
          });
          const data = await res.json();
          if (data.success) {
            setIsLocked(false);
            setDoc(prev => prev ? { ...prev, is_paid: true } : null);
          } else {
            alert('Payment verification failed: ' + data.error);
          }
        } catch (error) {
          alert('Network error verifying payment.');
        } finally {
          setVerifying(false);
        }
      }
    });
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${doc?.business_name || 'Business_Plan'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading || verifying) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '16px' }}>
        <Loader2 size={48} className="spinner" style={{ color: 'var(--color-primary)' }} />
        {verifying && <p style={{ color: 'var(--color-text-muted)' }}>Verifying your payment...</p>}
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className={styles.pageBackground}>
      <Navbar />
      <main className="container section">
        <div className={styles.headerRow}>
          <Link href="/dashboard" className="btn btn-ghost">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className={styles.actions}>
            <button 
              className="btn btn-primary" 
              onClick={isLocked ? handleUnlock : handleDownloadPDF} 
              disabled={downloading || (!isReady && isLocked)}
            >
              {downloading ? <Loader2 size={18} className="spinner" /> : (isLocked ? <Lock size={18} /> : <Download size={18} />)}
              {downloading ? 'Generating PDF...' : (isLocked ? 'Unlock Document' : 'Download PDF')}
            </button>
          </div>
        </div>

        <div className={styles.documentContainer}>
          <div className={styles.paper} ref={printRef} style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: isLocked ? 'blur(6px)' : 'none', opacity: isLocked ? 0.4 : 1, transition: 'all 0.3s ease', pointerEvents: isLocked ? 'none' : 'auto' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {doc.content || '# Empty Document'}
              </ReactMarkdown>
            </div>
            
            {isLocked && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                <div style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-2xl)', textAlign: 'center', maxWidth: '400px', border: '1px solid var(--color-border)' }}>
                  
                  {!showManualPayment ? (
                    <>
                      <div style={{ width: 64, height: 64, background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)' }}>
                        <Lock size={32} />
                      </div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Premium Document</h3>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
                        This document is ready! Pay <strong>₦2,500</strong> to unlock the full text and download the PDF.
                      </p>
                      <button 
                        className="btn btn-primary btn-lg" 
                        style={{ width: '100%', marginBottom: '12px' }} 
                        onClick={handleUnlock}
                        disabled={!isReady}
                      >
                        Pay ₦2,500 via Paystack
                      </button>
                      <button 
                        className="btn btn-outline btn-lg" 
                        style={{ width: '100%' }} 
                        onClick={() => setShowManualPayment(true)}
                      >
                        Pay via Bank Transfer
                      </button>
                      <p style={{ marginTop: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                        Or <Link href="/pricing" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>subscribe to Pro</Link> for unlimited access.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Bank Transfer</h3>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)', fontSize: '0.9375rem' }}>
                        Please transfer <strong>₦2,500</strong> to the account below and send your receipt to our WhatsApp to get unlocked.
                      </p>
                      
                      <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: 'var(--space-lg)', fontSize: '0.9375rem' }}>
                        <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--color-text-light)' }}>Bank:</span> <strong>Guaranty Trust Bank (GTB)</strong></div>
                        <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--color-text-light)' }}>Account Number:</span> <strong style={{ fontSize: '1.125rem', color: 'var(--color-primary)' }}>0123456789</strong></div>
                        <div><span style={{ color: 'var(--color-text-light)' }}>Name:</span> <strong>BizPlan Nigeria Ltd</strong></div>
                      </div>

                      <a href="https://wa.me/2348000000000?text=Hello,%20I%20just%20paid%20for%20a%20document%20(ID:%20{doc.id})" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px', background: '#25D366', borderColor: '#25D366' }}>
                        Send Receipt on WhatsApp
                      </a>
                      
                      <button 
                        className="btn btn-ghost" 
                        style={{ width: '100%' }} 
                        onClick={() => setShowManualPayment(false)}
                      >
                        Back to Paystack
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

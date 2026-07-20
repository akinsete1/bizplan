'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase, getUserSubscription, updateDocument } from '@/lib/supabase';
import { Document } from '@/lib/database.types';
import { ArrowLeft, Download, Loader2, Lock, Copy, CheckCircle2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './document.module.css';
import { usePaystack } from '@/components/payment/usePaystack';

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [copied, setCopied] = useState(false);
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
      if (!(data as any).is_paid) {
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

  const handleDownloadPDF = () => {
    if (!doc?.content) return;
    setDownloading(true);
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setDownloading(false); return; }
    
    const htmlContent = convertMarkdownToHTML(doc.content);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.business_name || 'Business Plan'} - BizPlan Nigeria</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; max-width: 820px; margin: 0 auto; padding: 48px 56px; color: #1a1a2e; line-height: 1.75; font-size: 15px; }
            h1 { font-family: 'Playfair Display', serif; color: #0A5C36; font-size: 2.25rem; border-bottom: 3px solid #F5A623; padding-bottom: 14px; margin-bottom: 24px; margin-top: 0; }
            h2 { color: #0A5C36; font-size: 1.35rem; margin-top: 2.5rem; margin-bottom: 10px; font-weight: 700; }
            h3 { color: #073d24; font-size: 1.05rem; margin-top: 1.5rem; margin-bottom: 6px; font-weight: 600; }
            p { margin-bottom: 14px; color: #374151; }
            ul, ol { margin: 0 0 16px 24px; }
            li { margin-bottom: 6px; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 14px; }
            thead { background: #0A5C36; color: white; }
            th { padding: 12px 14px; text-align: left; font-weight: 600; }
            td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
            tbody tr:nth-child(even) td { background: #f8faf9; }
            tbody tr:last-child td { border-bottom: none; }
            hr { border: none; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; }
            strong { color: #0A5C36; font-weight: 700; }
            .page-break { page-break-after: always; }
            .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
            @media print { body { padding: 24px 32px; } }
          </style>
        </head>
        <body>
          ${htmlContent}
          <div class="footer">Generated by BizPlan Nigeria | bizplannigeria.com</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    // Give fonts a moment to load, then print
    setTimeout(() => {
      printWindow.print();
      setDownloading(false);
    }, 800);
  };

  const convertMarkdownToHTML = (md: string) => {
    return md
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul|/])/gm, '<p>')
      .replace(/<p><\/p>/g, '');
  };

  const handleCopyToClipboard = async () => {
    if (!doc?.content) return;
    await navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className={styles.docMeta}>
            <span className="badge badge-primary"><FileText size={12} /> {doc.template_title}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {new Date(doc.updated_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className={styles.actions}>
            {!isLocked && (
              <button className="btn btn-ghost btn-sm" onClick={handleCopyToClipboard} title="Copy content">
                {copied ? <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={isLocked ? handleUnlock : handleDownloadPDF} 
              disabled={downloading || (!isReady && isLocked)}
            >
              {downloading ? <Loader2 size={18} className="spinner" /> : (isLocked ? <Lock size={18} /> : <Download size={18} />)}
              {downloading ? 'Opening PDF...' : (isLocked ? 'Unlock Document' : 'Download PDF')}
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

                      <a href={`https://wa.me/2348000000000?text=Hello,%20I%20just%20paid%20₦2500%20for%20document%20ID:%20${doc.id}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px', background: '#25D366', borderColor: '#25D366' }}>
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

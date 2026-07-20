'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Edit, CheckCircle2, Loader2, ArrowLeft, FileText, Plus, LayoutDashboard, Copy } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { getTemplateById } from '@/lib/templates';
import { generateDocument, type FormData } from '@/lib/documentGenerator';
import styles from './generate.module.css';

import { useCompletion } from '@ai-sdk/react';
import { supabase, saveDocument } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const template = getTemplateById(templateId);

  const [phase, setPhase] = useState<'initializing' | 'streaming' | 'done'>('initializing');
  const [saveError, setSaveError] = useState('');
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const contentEndRef = useRef<HTMLDivElement>(null);
  
  const { complete, completion, isLoading: isStreaming } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
    onFinish: async (prompt, result) => {
      const { data: { user } } = await supabase.auth.getUser();
      const formData = localStorage.getItem(`bizplan_final_${templateId}`);
      let parsedData: any = {};
      if (formData) parsedData = JSON.parse(formData);

      if (user) {
        const { data: savedDoc, error } = await saveDocument({
          user_id: user.id,
          template_id: templateId,
          template_title: template?.title || 'Business Plan',
          business_name: parsedData.businessName || 'My Business',
          status: 'completed',
          content: result,
          form_data: parsedData,
          is_paid: false,
        });

        if (error) {
          console.error('Failed to save document:', error);
          setSaveError('Document generated but failed to save to the cloud.');
        } else if (savedDoc) {
          setSavedDocId((savedDoc as any).id);
        }
      }
      setPhase('done');
    },
    onError: (err) => {
      console.error(err);
      alert('Error generating document: ' + err.message);
      setPhase('done');
    },
  });

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [completion, isStreaming]);

  // Transition from initializing to streaming
  useEffect(() => {
    if (isStreaming && phase === 'initializing') {
      setPhase('streaming');
    }
  }, [isStreaming, phase]);

  useEffect(() => {
    const formData = localStorage.getItem(`bizplan_final_${templateId}`) ||
                     localStorage.getItem(`bizplan_draft_${templateId}`);

    if (!formData) {
      router.push(`/create/${templateId}`);
      return;
    }

    const parsed: FormData = JSON.parse(formData);
    complete('', { body: parsed });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const handleDownloadPDF = () => {
    if (!completion) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = convertMarkdownToHTML(completion || '');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template?.title || 'Business Plan'} - BizPlan Nigeria</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; max-width: 820px; margin: 0 auto; padding: 48px 56px; color: #1a1a2e; line-height: 1.75; font-size: 15px; }
            h1 { font-family: 'Playfair Display', serif; color: #0A5C36; font-size: 2.25rem; border-bottom: 3px solid #F5A623; padding-bottom: 14px; margin-bottom: 24px; }
            h2 { color: #0A5C36; font-size: 1.35rem; margin-top: 2.5rem; margin-bottom: 10px; font-weight: 700; }
            h3 { color: #073d24; font-size: 1.05rem; margin-top: 1.5rem; margin-bottom: 6px; }
            p { margin-bottom: 14px; color: #374151; }
            ul, ol { margin: 0 0 16px 24px; }
            li { margin-bottom: 6px; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 14px; }
            thead { background: #0A5C36; color: white; }
            th { padding: 12px 14px; text-align: left; font-weight: 600; }
            td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
            tbody tr:nth-child(even) td { background: #f8faf9; }
            hr { border: none; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; }
            strong { color: #0A5C36; font-weight: 700; }
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
    setTimeout(() => printWindow.print(), 600);
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
      .replace(/\n\n/g, '</p><p>');
  };

  const handleCopy = async () => {
    if (!completion) return;
    await navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Phase: Initializing ─────────────────────────────────────────────
  if (phase === 'initializing') {
    return (
      <>
        <Navbar />
        <div className={styles.generatePage}>
          <div className={styles.loadingState}>
            <div className={styles.loadingCard}>
              <div className={styles.aiOrb}>
                <div className={styles.aiOrbRing} />
                <div className={styles.aiOrbRing} style={{ animationDelay: '0.3s' }} />
                <div className={styles.aiOrbCore}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.5 9H21L15 13.5L17.5 21L12 16.5L6.5 21L9 13.5L3 9H10.5L12 2Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <h2 className={styles.loadingTitle}>Connecting to AI...</h2>
              <p className={styles.loadingSubtitle}>
                Preparing your personalized {template?.title}
              </p>
              <div className={styles.loadingDots}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Phase: Streaming or Done ─────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className={styles.generatePage}>
        <div className={styles.documentView}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                <ArrowLeft size={16} /> Dashboard
              </Link>
              <div className={styles.toolbarTitle}>
                {phase === 'streaming' ? (
                  <span className={styles.streamingBadge}>
                    <span className={styles.streamingDot} />
                    AI Writing...
                  </span>
                ) : (
                  <span className="badge badge-success"><CheckCircle2 size={12} /> Document Ready</span>
                )}
                <span className={styles.docName}>{template?.title}</span>
              </div>
            </div>
            <div className={styles.toolbarRight}>
              {phase === 'done' && (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    {copied ? <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <Link href={`/create/${templateId}`} className="btn btn-ghost btn-sm">
                    <Edit size={14} /> Edit Answers
                  </Link>
                  <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
                    <Download size={14} /> Download PDF
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.documentContainer}>
            {saveError && (
              <div style={{ background: 'var(--color-danger)', color: 'white', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.9rem' }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Document Paper */}
            <div className={styles.documentPaper}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {completion || ''}
              </ReactMarkdown>
              {/* Blinking cursor while streaming */}
              {phase === 'streaming' && (
                <span className={styles.cursor} />
              )}
              <div ref={contentEndRef} />
            </div>

            {/* What's Next Panel — shown after generation */}
            {phase === 'done' && (
              <div className={styles.nextPanel}>
                <div className={styles.nextPanelHeader}>
                  <CheckCircle2 size={22} style={{ color: 'var(--color-primary)' }} />
                  <h3>Your document is ready!</h3>
                </div>
                <p className={styles.nextPanelSubtitle}>
                  It has been saved to your dashboard. What would you like to do next?
                </p>
                <div className={styles.nextActions}>
                  {savedDocId ? (
                    <Link href={`/dashboard/document/${savedDocId}`} className="btn btn-primary">
                      <FileText size={16} /> View Full Document
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="btn btn-primary">
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </Link>
                  )}
                  <button className="btn btn-outline" onClick={handleDownloadPDF}>
                    <Download size={16} /> Download PDF
                  </button>
                  <Link href="/templates" className="btn btn-ghost">
                    <Plus size={16} /> Create Another
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

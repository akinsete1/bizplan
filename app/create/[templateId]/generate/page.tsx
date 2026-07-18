'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Edit, Eye, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { getTemplateById } from '@/lib/templates';
import { generateDocument, type FormData } from '@/lib/documentGenerator';
import styles from './generate.module.css';

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const template = getTemplateById(templateId);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [document, setDocument] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_STEPS = [
    'Reading your business information...',
    'Structuring the document outline...',
    'Writing Executive Summary...',
    'Building Financial Projections...',
    'Generating Market Analysis...',
    'Finalising your professional document...',
  ];

  useEffect(() => {
    const formData = localStorage.getItem(`bizplan_final_${templateId}`) ||
                     localStorage.getItem(`bizplan_draft_${templateId}`);

    if (!formData) {
      router.push(`/create/${templateId}`);
      return;
    }

    const parsed: FormData = JSON.parse(formData);

    // Simulate progressive generation
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step - 1);
      setProgress(Math.min((step / LOADING_STEPS.length) * 100, 95));

      if (step >= LOADING_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          const doc = generateDocument(parsed);
          setDocument(doc);
          setProgress(100);
          setLoading(false);

          // Save to documents
          const docs = JSON.parse(localStorage.getItem('bizplan_documents') || '[]');
          const newDoc = {
            id: `doc_${Date.now()}`,
            templateId,
            templateTitle: template?.title || 'Business Plan',
            businessName: parsed.businessName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'completed',
            content: doc,
          };
          docs.unshift(newDoc);
          localStorage.setItem('bizplan_documents', JSON.stringify(docs));
        }, 500);
      }
    }, 700);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const htmlContent = convertMarkdownToHTML(document);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Plan</title>
          <style>
            body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; line-height: 1.7; }
            h1 { color: #0A5C36; font-size: 2rem; border-bottom: 3px solid #F5A623; padding-bottom: 12px; }
            h2 { color: #0A5C36; font-size: 1.25rem; margin-top: 2rem; }
            h3 { color: #073d24; font-size: 1rem; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th { background: #0A5C36; color: white; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) td { background: #f8faf9; }
            hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
            strong { color: #0A5C36; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const convertMarkdownToHTML = (md: string) => {
    return md
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/^\| (.+) \|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      })
      .replace(/(<tr>.+<\/tr>\n?)+/g, (m) => `<table>${m}</table>`)
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul|])/gm, '')
      .replace(/<p><\/p>/g, '');
  };

  return (
    <>
      <Navbar />
      <div className={styles.generatePage}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingIcon}>
                <Loader2 size={40} className={styles.spinner} />
              </div>
              <h2 className={styles.loadingTitle}>Generating Your Document</h2>
              <p className={styles.loadingSubtitle}>
                Please wait while we create your professional {template?.title}
              </p>

              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.progressLabel}>{Math.round(progress)}% complete</div>

              <div className={styles.loadingSteps}>
                {LOADING_STEPS.map((stepText, i) => (
                  <div
                    key={i}
                    className={`${styles.loadingStep} ${i < loadingStep ? styles.stepDone : ''} ${i === loadingStep ? styles.stepActive : ''}`}
                  >
                    <div className={styles.loadingStepIcon}>
                      {i < loadingStep ? <CheckCircle2 size={16} color="var(--color-success)" /> : <div className={styles.stepDot} />}
                    </div>
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.documentView}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <Link href="/dashboard" className="btn btn-ghost btn-sm">
                  <ArrowLeft size={16} /> Dashboard
                </Link>
                <div className={styles.toolbarTitle}>
                  <span className="badge badge-success"><CheckCircle2 size={12} /> Document Ready</span>
                  <span className={styles.docName}>{template?.title}</span>
                </div>
              </div>
              <div className={styles.toolbarRight}>
                <Link href={`/create/${templateId}`} className="btn btn-ghost btn-sm">
                  <Edit size={14} /> Edit Answers
                </Link>
                <button className="btn btn-outline btn-sm">
                  <Eye size={14} /> Preview
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>

            <div className={styles.documentContainer}>
              {/* Document Preview */}
              <div className={styles.documentPaper}>
                <pre className={styles.documentContent}>{document}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

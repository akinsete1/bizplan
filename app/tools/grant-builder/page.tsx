'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase, saveDocument } from '@/lib/supabase';
import styles from './grant-builder.module.css';

const GRANT_TYPES = [
  { id: 'general', label: 'General Grant Application', emoji: '📋', description: 'For general government or foundation grants' },
  { id: 'youth', label: 'Youth Entrepreneurship Grant', emoji: '👨‍🎓', description: 'NYIF, CBN Youth Grant, and similar youth-focused funding' },
  { id: 'women', label: 'Women Entrepreneurship Grant', emoji: '👩‍💼', description: 'Grants specifically for women-led businesses' },
  { id: 'agricultural', label: 'Agricultural Grant', emoji: '🌾', description: 'BOI agric loans, NIRSAL, and agricultural grants' },
  { id: 'tech', label: 'Tech Startup Grant', emoji: '💻', description: 'For technology startups and digital innovation projects' },
  { id: 'ngo', label: 'NGO Funding Proposal', emoji: '🤝', description: 'Proposals for NGO and foundation support' },
  { id: 'foundation', label: 'Foundation Grant Proposal', emoji: '🌟', description: 'TEF, Ford Foundation, and similar grant applications' },
];

const GRANT_SECTIONS = [
  'Cover Letter', 'Executive Summary', 'Problem Statement', 'Business Solution',
  'Project Objectives', 'Target Beneficiaries', 'Implementation Plan',
  'Project Timeline', 'Budget & Use of Funds', 'Expected Outcomes',
  'Sustainability Plan', 'Monitoring & Evaluation', 'Conclusion',
];

export default function GrantBuilderPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState<'select' | 'form' | 'generating' | 'done'>('select');
  const [genProgress, setGenProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    orgName: '', contactName: '', email: '', phone: '', state: '',
    projectTitle: '', problemDescription: '', solutionDescription: '',
    objectives: '', beneficiaries: '', timeline: '', totalBudget: '',
    expectedOutcomes: '', sustainability: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleGenerate = async () => {
    if (!userId) {
      alert("Please sign in to generate and save your document.");
      router.push('/login?next=/tools/grant-builder');
      return;
    }

    setStep('generating');
    setGenProgress(10);

    const templateLabel = GRANT_TYPES.find(t => t.id === selectedType)?.label || 'Grant Proposal';

    // Build a detailed prompt for the AI
    const prompt = `Generate a comprehensive, professional ${templateLabel} for the following organisation:

Organisation Name: ${form.orgName}
Contact Person: ${form.contactName}
Location: ${form.state}
Project Title: ${form.projectTitle}

Problem Statement: ${form.problemDescription}

Proposed Solution: ${form.solutionDescription}

Project Objectives: ${form.objectives || 'To be determined based on the project scope'}

Target Beneficiaries: ${form.beneficiaries || 'Local community members'}

Total Budget Requested: ₦${form.totalBudget}
Project Duration: ${form.timeline || '12 months'}

Expected Outcomes: ${form.expectedOutcomes || 'Measurable community impact'}

Sustainability Plan: ${form.sustainability || 'Revenue generation through services'}

Please write a detailed grant proposal including: Cover Letter, Executive Summary, Problem Statement, Business Solution, Project Objectives, Target Beneficiaries, Implementation Plan, Project Timeline, Budget & Use of Funds, Expected Outcomes, Sustainability Plan, Monitoring & Evaluation, and Conclusion. Format using Markdown with proper headings.`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok || !response.body) throw new Error('Generation failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let p = 20;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        p = Math.min(p + 5, 95);
        setGenProgress(p);
      }

      setGenProgress(100);

      const { data: doc, error } = await saveDocument({
        user_id: userId,
        template_id: 'grant-' + selectedType,
        template_title: templateLabel,
        business_name: form.orgName,
        status: 'completed',
        content: fullContent,
        form_data: form as any,
        is_paid: false,
      });

      if (error || !doc) {
        alert('Error saving document: ' + (error?.message || 'Unknown error'));
        setStep('form');
        return;
      }

      setTimeout(() => {
        router.push(`/dashboard/document/${(doc as any).id}`);
      }, 400);

    } catch (err: any) {
      alert('Generation error: ' + err.message);
      setStep('form');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.toolPage}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className="container">
            <div className="section-label">Funding Tool</div>
            <h1 className={styles.pageTitle}>Grant Proposal Builder</h1>
            <p className={styles.pageSubtitle}>
              Generate a professional grant proposal for Nigerian government grants, foundation funding, and NGO support.
            </p>
          </div>
        </div>

        <div className="container">
          {/* Warning */}
          <div className={`alert alert-warning ${styles.warningBanner}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Important:</strong> Always review the specific requirements of the grant programme before submitting your application. Each programme may have unique documentation requirements.
            </span>
          </div>

          {/* Step: Select Grant Type */}
          {step === 'select' && (
            <div className={styles.selectSection}>
              <h2 className={styles.selectTitle}>Select Your Grant Type</h2>
              <div className={styles.grantTypeGrid}>
                {GRANT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    className={`${styles.grantTypeCard} ${selectedType === type.id ? styles.selected : ''}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className={styles.grantEmoji}>{type.emoji}</div>
                    <div className={styles.grantTypeLabel}>{type.label}</div>
                    <div className={styles.grantTypeDesc}>{type.description}</div>
                    {selectedType === type.id && <CheckCircle2 size={20} className={styles.grantCheck} />}
                  </button>
                ))}
              </div>
              <div className={styles.selectCTA}>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!selectedType}
                  onClick={() => setStep('form')}
                >
                  Continue with This Grant Type <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step: Form */}
          {step === 'form' && (
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                <div>
                  <div className="badge badge-primary">
                    {GRANT_TYPES.find(t => t.id === selectedType)?.emoji} {GRANT_TYPES.find(t => t.id === selectedType)?.label}
                  </div>
                  <h2 className={styles.formTitle}>Tell Us About Your Project</h2>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep('select')}>← Change Type</button>
              </div>

              {/* Sections to be generated */}
              <div className={styles.sectionsList}>
                <h4 className={styles.sectionsTitle}>Your proposal will include:</h4>
                <div className={styles.sectionsGrid}>
                  {GRANT_SECTIONS.map((s, i) => (
                    <div key={i} className={styles.sectionItem}>
                      <CheckCircle2 size={14} color="var(--color-primary)" /> {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Organisation Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Organisation / Business Name<span>*</span></label>
                    <input className="form-input" type="text" placeholder="Your org name" value={form.orgName} onChange={e => set('orgName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Person<span>*</span></label>
                    <input className="form-input" type="text" placeholder="Full name" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address<span>*</span></label>
                    <input className="form-input" type="email" placeholder="contact@org.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Project Information</h3>
                <div className={styles.questionList}>
                  <div className="form-group">
                    <label className="form-label">Project Title<span>*</span></label>
                    <input className="form-input" type="text" placeholder="Name of your project or business initiative" value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">🔍 What problem does your project address?<span>*</span></label>
                    <textarea className="form-textarea" placeholder="Describe the problem or challenge your project aims to solve..." rows={4} value={form.problemDescription} onChange={e => set('problemDescription', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">💡 What is your proposed solution?<span>*</span></label>
                    <textarea className="form-textarea" placeholder="Describe your business solution and how it addresses the problem..." rows={4} value={form.solutionDescription} onChange={e => set('solutionDescription', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">🎯 Project Objectives</label>
                    <textarea className="form-textarea" placeholder="List 3-5 specific, measurable objectives of your project..." rows={4} value={form.objectives} onChange={e => set('objectives', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">👥 Who are your target beneficiaries?</label>
                    <textarea className="form-textarea" placeholder="Who will benefit from this project? Number of people, demographics, location..." rows={3} value={form.beneficiaries} onChange={e => set('beneficiaries', e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Total Budget Requested (₦)<span>*</span></label>
                      <input className="form-input" type="text" placeholder="e.g. 5,000,000" value={form.totalBudget} onChange={e => set('totalBudget', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project Duration</label>
                      <input className="form-input" type="text" placeholder="e.g. 12 months" value={form.timeline} onChange={e => set('timeline', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">📊 Expected Outcomes</label>
                    <textarea className="form-textarea" placeholder="What measurable outcomes do you expect from this project?" rows={3} value={form.expectedOutcomes} onChange={e => set('expectedOutcomes', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">🌱 Sustainability Plan</label>
                    <textarea className="form-textarea" placeholder="How will this project continue to generate impact after the grant period?" rows={3} value={form.sustainability} onChange={e => set('sustainability', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className="btn btn-ghost" onClick={() => setStep('select')}>← Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleGenerate}
                  disabled={!form.orgName || !form.projectTitle || !form.problemDescription || !form.solutionDescription}
                >
                  Generate Grant Proposal <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Generating */}
          {step === 'generating' && (
            <div className={styles.generatingState}>
              <div className={styles.genCard}>
                <Loader2 size={48} className={styles.spinner} />
                <h2>Generating Your Grant Proposal</h2>
                <p>Please wait while we craft your professional proposal...</p>
                <div className="progress-bar" style={{ margin: '20px 0' }}>
                  <div className="progress-fill" style={{ width: `${genProgress}%` }} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{genProgress}% complete</div>
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className={styles.doneState}>
              <div className={styles.doneHeader}>
                <CheckCircle2 size={48} color="var(--color-success)" />
                <h2>Your Grant Proposal is Ready!</h2>
                <p>A professional {GRANT_TYPES.find(t => t.id === selectedType)?.label} has been generated for <strong>{form.orgName}</strong></p>
              </div>
              <div className={styles.doneActions}>
                <button className="btn btn-primary btn-lg">
                  Download PDF
                </button>
                <button className="btn btn-outline btn-lg">
                  Edit Proposal
                </button>
                <button className="btn btn-ghost" onClick={() => { setStep('select'); setSelectedType(''); }}>
                  Create Another
                </button>
              </div>
              <div className={styles.proposalPreview}>
                <h3>Your proposal includes:</h3>
                <div className={styles.sectionsGrid}>
                  {GRANT_SECTIONS.map((s, i) => (
                    <div key={i} className={`${styles.sectionItem} ${styles.sectionDone}`}>
                      <CheckCircle2 size={14} color="var(--color-success)" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

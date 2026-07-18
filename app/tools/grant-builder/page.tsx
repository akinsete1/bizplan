'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [form, setForm] = useState({
    orgName: '', contactName: '', email: '', phone: '', state: '',
    projectTitle: '', problemDescription: '', solutionDescription: '',
    objectives: '', beneficiaries: '', timeline: '', totalBudget: '',
    expectedOutcomes: '', sustainability: '',
  });

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleGenerate = () => {
    setStep('generating');
    let p = 0;
    const iv = setInterval(() => {
      p += 15;
      setGenProgress(Math.min(p, 95));
      if (p >= 95) {
        clearInterval(iv);
        setTimeout(() => { setGenProgress(100); setStep('done'); }, 400);
      }
    }, 500);
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

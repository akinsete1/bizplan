'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase, saveDocument } from '@/lib/supabase';
import { generateDocument, type FormData as DocFormData } from '@/lib/documentGenerator';
import styles from '../grant-builder/grant-builder.module.css';
import loanStyles from './loan-builder.module.css';

const LOAN_PURPOSES = [
  { id: 'expansion', label: 'Business Expansion', emoji: '📈', description: 'Grow to new locations or increase capacity' },
  { id: 'equipment', label: 'Equipment Purchase', emoji: '⚙️', description: 'Buy machinery, tools, or technology' },
  { id: 'working-capital', label: 'Working Capital', emoji: '💼', description: 'Fund daily operations and expenses' },
  { id: 'inventory', label: 'Inventory / Stock', emoji: '📦', description: 'Purchase goods or raw materials' },
  { id: 'startup', label: 'Business Startup', emoji: '🚀', description: 'Fund a new business venture' },
  { id: 'asset', label: 'Asset Acquisition', emoji: '🏗️', description: 'Land, vehicles, or commercial property' },
];

const LOAN_SECTIONS = [
  'Business Profile', 'Loan Request & Purpose', 'Business Revenue Overview',
  'Repayment Plan', 'Cash Flow Forecast', 'Existing Assets & Collateral',
  'Financial Projections', 'Risk Management', 'Business Owner Profile', 'Conclusion',
];

export default function LoanBuilderPage() {
  const router = useRouter();
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [step, setStep] = useState<'select' | 'form' | 'generating' | 'done'>('select');
  const [genProgress, setGenProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: '', ownerName: '', email: '', phone: '', state: '',
    businessType: '', industry: '', yearsInOperation: '',
    loanAmount: '', loanPurpose: '', repaymentPeriod: '',
    monthlyRevenue: '', monthlyExpenses: '', existingLoans: '',
    collateral: '', collateralValue: '', bankName: '',
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
      router.push('/login?next=/tools/loan-builder');
      return;
    }

    setStep('generating');
    let p = 0;
    const iv = setInterval(() => {
      p += 12;
      setGenProgress(Math.min(p, 90));
    }, 500);

    const templateLabel = LOAN_PURPOSES.find(t => t.id === selectedPurpose)?.label || 'Bank Loan Proposal';

    // Map form to document generator format
    const mappedData: DocFormData = {
      fullName: form.ownerName,
      email: form.email,
      phone: form.phone,
      location: '',
      state: form.state,
      ownerType: 'Business Owner',
      businessName: form.businessName,
      businessType: form.businessType || 'SME',
      industry: form.industry || 'Commerce',
      businessLocation: form.state,
      yearEstablished: form.yearsInOperation ? String(new Date().getFullYear() - parseInt(form.yearsInOperation)) : '',
      employees: '',
      businessDescription: 'A growing business seeking funding for ' + form.loanPurpose,
      problemSolved: '',
      targetCustomers: '',
      productsServices: '',
      uniqueValue: '',
      amountNeeded: form.loanAmount,
      fundingPurpose: form.loanPurpose,
      fundingType: 'Bank Loan',
      fundingBreakdown: [],
      monthlyRevenue: form.monthlyRevenue,
      monthlyExpenses: form.monthlyExpenses,
      costOfGoods: '',
      staffSalaries: '',
      rent: '',
      marketingBudget: '',
      otherExpenses: '',
      goals12Months: 'Repay loan over ' + form.repaymentPeriod,
      goals3Years: '',
      jobsCreated: '',
      fundingImpact: 'Successfully execute ' + templateLabel,
      templateId: 'loan',
      templateTitle: templateLabel,
    };

    const generatedMarkdown = generateDocument(mappedData);

    // Append extra sections specific to loan like Collateral and Existing Loans
    const finalContent = generatedMarkdown + `
## SECTION 18: ADDITIONAL LOAN DETAILS
**Repayment Period:** ${form.repaymentPeriod}
**Collateral Offered:** ${form.collateral}
**Estimated Collateral Value:** ₦${form.collateralValue || '0'}
**Existing Financial Obligations:** ${form.existingLoans}
**Target Bank:** ${form.bankName}
`;

    const { data: doc, error } = await saveDocument({
      user_id: userId,
      template_id: 'loan',
      template_title: templateLabel,
      business_name: form.businessName,
      status: 'completed',
      content: finalContent,
      form_data: form,
      is_paid: false,
    });

    clearInterval(iv);
    setGenProgress(100);

    if (error || !doc) {
      alert('Error saving document: ' + (error?.message || 'Unknown error'));
      setStep('form');
      return;
    }

    setTimeout(() => {
      router.push(`/dashboard/document/${doc.id}`);
    }, 500);
  };

  return (
    <>
      <Navbar />
      <div className={styles.toolPage}>
        <div className={styles.pageHeader}>
          <div className="container">
            <div className="section-label">Funding Tool</div>
            <h1 className={styles.pageTitle}>Bank Loan Proposal Builder</h1>
            <p className={styles.pageSubtitle}>
              Generate a professional bank loan proposal formatted to meet Nigerian bank requirements, including cash flow forecasts and repayment plans.
            </p>
          </div>
        </div>

        <div className="container">
          {step === 'select' && (
            <div className={styles.selectSection}>
              <h2 className={styles.selectTitle}>What is the loan for?</h2>
              <div className={styles.grantTypeGrid}>
                {LOAN_PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    className={`${styles.grantTypeCard} ${selectedPurpose === p.id ? styles.selected : ''}`}
                    onClick={() => setSelectedPurpose(p.id)}
                  >
                    <div className={styles.grantEmoji}>{p.emoji}</div>
                    <div className={styles.grantTypeLabel}>{p.label}</div>
                    <div className={styles.grantTypeDesc}>{p.description}</div>
                    {selectedPurpose === p.id && <CheckCircle2 size={20} className={styles.grantCheck} />}
                  </button>
                ))}
              </div>
              <div className={styles.selectCTA}>
                <button className="btn btn-primary btn-lg" disabled={!selectedPurpose} onClick={() => setStep('form')}>
                  Build Loan Proposal <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                <div>
                  <div className="badge badge-primary">
                    {LOAN_PURPOSES.find(p => p.id === selectedPurpose)?.emoji} {LOAN_PURPOSES.find(p => p.id === selectedPurpose)?.label}
                  </div>
                  <h2 className={styles.formTitle}>Business & Loan Details</h2>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep('select')}>← Change Purpose</button>
              </div>

              <div className={styles.sectionsList}>
                <h4 className={styles.sectionsTitle}>Your loan proposal will include:</h4>
                <div className={styles.sectionsGrid}>
                  {LOAN_SECTIONS.map((s, i) => (
                    <div key={i} className={styles.sectionItem}>
                      <CheckCircle2 size={14} color="var(--color-primary)" /> {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Business Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Business Name<span>*</span></label>
                    <input className="form-input" type="text" placeholder="Your business name" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Owner Name<span>*</span></label>
                    <input className="form-input" type="text" placeholder="Full name" value={form.ownerName} onChange={e => set('ownerName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email<span>*</span></label>
                    <input className="form-input" type="email" placeholder="you@business.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years in Operation</label>
                    <input className="form-input" type="text" placeholder="e.g. 3 years" value={form.yearsInOperation} onChange={e => set('yearsInOperation', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Bank</label>
                    <input className="form-input" type="text" placeholder="e.g. GTBank, Access Bank" value={form.bankName} onChange={e => set('bankName', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Loan Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Loan Amount Requested (₦)<span>*</span></label>
                    <input className="form-input" type="text" placeholder="e.g. 10,000,000" value={form.loanAmount} onChange={e => set('loanAmount', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Repayment Period</label>
                    <select className="form-select" value={form.repaymentPeriod} onChange={e => set('repaymentPeriod', e.target.value)}>
                      <option value="">Select period</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                      <option value="18 months">18 months</option>
                      <option value="24 months">24 months</option>
                      <option value="36 months">36 months</option>
                      <option value="48 months">48 months</option>
                      <option value="60 months">60 months</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Revenue (₦)</label>
                    <input className="form-input" type="text" placeholder="Current monthly revenue" value={form.monthlyRevenue} onChange={e => set('monthlyRevenue', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Expenses (₦)</label>
                    <input className="form-input" type="text" placeholder="Total monthly expenses" value={form.monthlyExpenses} onChange={e => set('monthlyExpenses', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="form-label">What will the loan be used for?<span>*</span></label>
                  <textarea className="form-textarea" placeholder="Describe exactly how the loan funds will be used..." rows={4} value={form.loanPurpose} onChange={e => set('loanPurpose', e.target.value)} />
                </div>
              </div>

              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Collateral & Existing Loans</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Collateral / Security Offered</label>
                    <input className="form-input" type="text" placeholder="e.g. Property, Vehicle, Equipment" value={form.collateral} onChange={e => set('collateral', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Collateral Value (₦)</label>
                    <input className="form-input" type="text" placeholder="e.g. 5,000,000" value={form.collateralValue} onChange={e => set('collateralValue', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="form-label">Existing Loans / Financial Obligations</label>
                  <textarea className="form-textarea" placeholder="List any existing loans or financial commitments (or write 'None')" rows={2} value={form.existingLoans} onChange={e => set('existingLoans', e.target.value)} />
                </div>
              </div>

              <div className={styles.formActions}>
                <button className="btn btn-ghost" onClick={() => setStep('select')}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={!form.businessName || !form.loanAmount || !form.loanPurpose}>
                  Generate Loan Proposal <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className={styles.generatingState}>
              <div className={styles.genCard}>
                <Loader2 size={48} className={styles.spinner} />
                <h2>Building Your Loan Proposal</h2>
                <p>Formatting professional banking document...</p>
                <div className="progress-bar" style={{ margin: '20px 0' }}>
                  <div className="progress-fill" style={{ width: `${genProgress}%` }} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{genProgress}% complete</div>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className={styles.doneState}>
              <div className={styles.doneHeader}>
                <CheckCircle2 size={48} color="var(--color-success)" />
                <h2>Loan Proposal Ready!</h2>
                <p>A professional bank loan proposal for <strong>{form.businessName}</strong> has been generated.</p>
              </div>
              <div className={styles.doneActions}>
                <button className="btn btn-primary btn-lg">Download PDF</button>
                <button className="btn btn-outline btn-lg">Edit Proposal</button>
                <button className="btn btn-ghost" onClick={() => { setStep('select'); setSelectedPurpose(''); }}>Create Another</button>
              </div>
              <div className={styles.proposalPreview}>
                <h3>Your loan proposal includes:</h3>
                <div className={styles.sectionsGrid}>
                  {LOAN_SECTIONS.map((s, i) => (
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

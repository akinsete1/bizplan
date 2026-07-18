'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Save, Plus, Minus, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { getTemplateById, NIGERIAN_STATES, BUSINESS_TYPES, INDUSTRIES, FUNDING_TYPES, SPENDING_CATEGORIES } from '@/lib/templates';
import type { FormData } from '@/lib/documentGenerator';
import styles from './create.module.css';

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  'Personal Info',
  'Business Info',
  'Business Idea',
  'Funding Details',
  'Financial Data',
  'Business Goals',
];

const DEFAULT_FORM: FormData = {
  fullName: '', email: '', phone: '', location: '', state: '', ownerType: '',
  businessName: '', businessType: '', industry: '', businessLocation: '',
  yearEstablished: '', employees: '', businessDescription: '',
  problemSolved: '', targetCustomers: '', productsServices: '', uniqueValue: '',
  amountNeeded: '', fundingPurpose: '', fundingType: '',
  fundingBreakdown: [{ item: '', amount: '' }],
  monthlyRevenue: '', monthlyExpenses: '', costOfGoods: '', staffSalaries: '',
  rent: '', marketingBudget: '', otherExpenses: '',
  goals12Months: '', goals3Years: '', jobsCreated: '', fundingImpact: '',
  templateId: '', templateTitle: '',
};

export default function CreatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const template = getTemplateById(templateId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    ...DEFAULT_FORM,
    templateId,
    templateTitle: template?.title || 'Business Plan',
    industry: template?.industry || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    const key = `bizplan_draft_${templateId}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, [templateId]);

  const handleChange = useCallback((field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveProgress = useCallback(() => {
    setSaving(true);
    localStorage.setItem(`bizplan_draft_${templateId}`, JSON.stringify(form));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  }, [form, templateId]);

  const handleNext = () => {
    saveProgress();
    if (step < TOTAL_STEPS) setStep(step + 1);
    else {
      // Save final form and go to generate
      localStorage.setItem(`bizplan_final_${templateId}`, JSON.stringify(form));
      router.push(`/create/${templateId}/generate`);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addBreakdownItem = () => {
    handleChange('fundingBreakdown', [...form.fundingBreakdown, { item: '', amount: '' }]);
  };

  const removeBreakdownItem = (idx: number) => {
    handleChange('fundingBreakdown', form.fundingBreakdown.filter((_, i) => i !== idx));
  };

  const updateBreakdown = (idx: number, field: 'item' | 'amount', value: string) => {
    const updated = form.fundingBreakdown.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    handleChange('fundingBreakdown', updated);
  };

  const breakdownTotal = form.fundingBreakdown.reduce(
    (sum, row) => sum + (parseFloat(row.amount?.replace(/,/g, '') || '0') || 0),
    0
  );

  const parse = (v: string) => parseFloat(v?.replace(/,/g, '') || '0') || 0;
  const totalExpenses = parse(form.costOfGoods) + parse(form.staffSalaries) + parse(form.rent) + parse(form.marketingBudget) + parse(form.otherExpenses);
  const monthlyProfit = parse(form.monthlyRevenue) - totalExpenses;
  const annualRevenue = parse(form.monthlyRevenue) * 12;
  const annualProfit = monthlyProfit * 12;

  const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  if (!template) {
    return (
      <>
        <Navbar />
        <div className="container section" style={{ textAlign: 'center' }}>
          <h2>Template not found</h2>
          <Link href="/templates" className="btn btn-primary" style={{ marginTop: '24px' }}>Browse Templates</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.createPage}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.templateIcon} style={{ background: `${template.color}15`, color: template.color }}>
              {template.emoji}
            </div>
            <div>
              <div className={styles.templateName}>{template.title}</div>
              <div className={styles.templateIndustry}>{template.industry}</div>
            </div>
          </div>

          <div className={styles.stepsList}>
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === step;
              const isDone = stepNum < step;
              return (
                <div
                  key={i}
                  className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isDone ? styles.stepDone : ''}`}
                  onClick={() => stepNum < step && setStep(stepNum)}
                >
                  <div className={styles.stepCircle}>
                    {isDone ? '✓' : stepNum}
                  </div>
                  <span className={styles.stepLabel}>{label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.sidebarSave}>
            <button className="btn btn-outline btn-sm" onClick={saveProgress} style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={14} />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Progress'}
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className={styles.formArea}>
          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.formWrapper}>
            {/* Step header */}
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step {step} of {TOTAL_STEPS}</div>
              <h2 className={styles.stepTitle}>{STEP_LABELS[step - 1]}</h2>
            </div>

            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Tell us a bit about yourself as the business owner.</p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name<span>*</span></label>
                    <input type="text" className="form-input" placeholder="Your full name" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address<span>*</span></label>
                    <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number<span>*</span></label>
                    <input type="tel" className="form-input" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your City/Town</label>
                    <input type="text" className="form-input" placeholder="e.g. Ikeja, Owerri, Kano" value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State<span>*</span></label>
                    <select className="form-select" value={form.state} onChange={(e) => handleChange('state', e.target.value)}>
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Owner Type</label>
                    <select className="form-select" value={form.ownerType} onChange={(e) => handleChange('ownerType', e.target.value)}>
                      <option value="">Select type</option>
                      <option value="Solo Entrepreneur">Solo Entrepreneur</option>
                      <option value="NYSC Corps Member">NYSC Corps Member</option>
                      <option value="Student Entrepreneur">Student Entrepreneur</option>
                      <option value="Woman Entrepreneur">Woman Entrepreneur</option>
                      <option value="Youth (under 35)">Youth (under 35)</option>
                      <option value="Farmer/Agribusiness Owner">Farmer/Agribusiness Owner</option>
                      <option value="Startup Founder">Startup Founder</option>
                      <option value="SME Owner">SME Owner</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Business Info */}
            {step === 2 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Tell us about your business. Keep your answers simple and clear.</p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Business Name<span>*</span></label>
                    <input type="text" className="form-input" placeholder="Your business name" value={form.businessName} onChange={(e) => handleChange('businessName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Type</label>
                    <select className="form-select" value={form.businessType} onChange={(e) => handleChange('businessType', e.target.value)}>
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry<span>*</span></label>
                    <select className="form-select" value={form.industry} onChange={(e) => handleChange('industry', e.target.value)}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Location</label>
                    <input type="text" className="form-input" placeholder="Business address or area" value={form.businessLocation} onChange={(e) => handleChange('businessLocation', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year Established</label>
                    <input type="number" className="form-input" placeholder={`${new Date().getFullYear()}`} min="1900" max={new Date().getFullYear()} value={form.yearEstablished} onChange={(e) => handleChange('yearEstablished', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Employees</label>
                    <select className="form-select" value={form.employees} onChange={(e) => handleChange('employees', e.target.value)}>
                      <option value="">Select range</option>
                      <option value="1 (Just me)">1 (Just me)</option>
                      <option value="2-5">2-5</option>
                      <option value="6-10">6-10</option>
                      <option value="11-25">11-25</option>
                      <option value="26-50">26-50</option>
                      <option value="50+">50+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="form-label">Describe Your Business<span>*</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="Briefly describe what your business does, what it sells, and who it serves..."
                    rows={4}
                    value={form.businessDescription}
                    onChange={(e) => handleChange('businessDescription', e.target.value)}
                  />
                  <span className="form-hint">Write in simple language. We will make it professional.</span>
                </div>
              </div>
            )}

            {/* STEP 3: Business Idea */}
            {step === 3 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Answer in simple language — we'll transform it into professional business writing.</p>
                <div className={styles.questionList}>
                  <div className="form-group">
                    <label className="form-label">🔍 What problem does your business solve?<span>*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="What challenge or pain point does your product/service address for customers?"
                      rows={3}
                      value={form.problemSolved}
                      onChange={(e) => handleChange('problemSolved', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">👥 Who are your target customers?<span>*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="Who are the people or businesses that buy from you? Age, location, income level, etc."
                      rows={3}
                      value={form.targetCustomers}
                      onChange={(e) => handleChange('targetCustomers', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">🛍️ What products or services do you offer?<span>*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="List your main products or services and what makes them valuable to customers."
                      rows={4}
                      value={form.productsServices}
                      onChange={(e) => handleChange('productsServices', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">⭐ What makes your business different?</label>
                    <textarea
                      className="form-textarea"
                      placeholder="What sets you apart from competitors? Why would customers choose you over others?"
                      rows={3}
                      value={form.uniqueValue}
                      onChange={(e) => handleChange('uniqueValue', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Funding */}
            {step === 4 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Tell us about the funding you're seeking.</p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Amount Needed (₦)<span>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 5,000,000"
                      value={form.amountNeeded}
                      onChange={(e) => handleChange('amountNeeded', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Funding Type</label>
                    <select className="form-select" value={form.fundingType} onChange={(e) => handleChange('fundingType', e.target.value)}>
                      <option value="">Select funding type</option>
                      {FUNDING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="form-label">💡 What is the purpose of this funding?</label>
                  <textarea
                    className="form-textarea"
                    placeholder="What do you plan to do with the money? e.g. Buy equipment, expand to a new location, hire staff..."
                    rows={3}
                    value={form.fundingPurpose}
                    onChange={(e) => handleChange('fundingPurpose', e.target.value)}
                  />
                </div>

                {/* Funding Breakdown */}
                <div className={styles.breakdownSection}>
                  <div className={styles.breakdownHeader}>
                    <div>
                      <h4 className={styles.breakdownTitle}>Funding Breakdown</h4>
                      <p className={styles.breakdownSubtitle}>Break down how you will spend the money</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={addBreakdownItem}>
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className={styles.breakdownRows}>
                    {form.fundingBreakdown.map((row, idx) => (
                      <div key={idx} className={styles.breakdownRow}>
                        <select
                          className="form-select"
                          value={row.item}
                          onChange={(e) => updateBreakdown(idx, 'item', e.target.value)}
                          style={{ flex: 2 }}
                        >
                          <option value="">Select item</option>
                          {SPENDING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className={styles.amountInput}>
                          <span className={styles.nairaSign}>₦</span>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Amount"
                            value={row.amount}
                            onChange={(e) => updateBreakdown(idx, 'amount', e.target.value)}
                          />
                        </div>
                        {form.fundingBreakdown.length > 1 && (
                          <button className={styles.removeBtn} onClick={() => removeBreakdownItem(idx)}>
                            <Minus size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.breakdownTotal}>
                    <span>Total</span>
                    <strong>₦{breakdownTotal.toLocaleString('en-NG')}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Financial Projections */}
            {step === 5 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Enter your estimated monthly numbers. These will be used to calculate your financial projections.</p>
                <div className={styles.financialNote}>
                  💡 Use your best estimates. If you're just starting out, use your expected figures.
                </div>

                <div className={styles.financialGrid}>
                  <div className={styles.financialInput}>
                    <label className="form-label">Monthly Revenue (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 500,000" value={form.monthlyRevenue} onChange={(e) => handleChange('monthlyRevenue', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.financialInput}>
                    <label className="form-label">Cost of Goods / Production (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 150,000" value={form.costOfGoods} onChange={(e) => handleChange('costOfGoods', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.financialInput}>
                    <label className="form-label">Staff Salaries (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 100,000" value={form.staffSalaries} onChange={(e) => handleChange('staffSalaries', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.financialInput}>
                    <label className="form-label">Rent & Utilities (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 50,000" value={form.rent} onChange={(e) => handleChange('rent', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.financialInput}>
                    <label className="form-label">Marketing Budget (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 30,000" value={form.marketingBudget} onChange={(e) => handleChange('marketingBudget', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.financialInput}>
                    <label className="form-label">Other Expenses (₦)</label>
                    <div className={styles.amountInput}>
                      <span className={styles.nairaSign}>₦</span>
                      <input type="text" className="form-input" placeholder="e.g. 20,000" value={form.otherExpenses} onChange={(e) => handleChange('otherExpenses', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Auto-calculated summary */}
                <div className={styles.calcSummary}>
                  <h4 className={styles.calcTitle}>📊 Calculated Projections</h4>
                  <div className={styles.calcGrid}>
                    <div className={styles.calcItem}>
                      <span className={styles.calcLabel}>Total Monthly Expenses</span>
                      <span className={styles.calcValue}>{fmt(totalExpenses)}</span>
                    </div>
                    <div className={`${styles.calcItem} ${monthlyProfit >= 0 ? styles.calcPositive : styles.calcNegative}`}>
                      <span className={styles.calcLabel}>Estimated Monthly Profit</span>
                      <span className={styles.calcValue}>{fmt(monthlyProfit)}</span>
                    </div>
                    <div className={styles.calcItem}>
                      <span className={styles.calcLabel}>Annual Revenue</span>
                      <span className={styles.calcValue}>{fmt(annualRevenue)}</span>
                    </div>
                    <div className={`${styles.calcItem} ${annualProfit >= 0 ? styles.calcPositive : styles.calcNegative}`}>
                      <span className={styles.calcLabel}>Annual Profit</span>
                      <span className={styles.calcValue}>{fmt(annualProfit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Goals */}
            {step === 6 && (
              <div className={styles.formSection}>
                <p className={styles.stepHint}>Share your vision for the future of your business.</p>
                <div className={styles.questionList}>
                  <div className="form-group">
                    <label className="form-label">🎯 What are your goals for the next 12 months?<span>*</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="What do you want to achieve in the first year? Sales targets, new products, new locations..."
                      rows={4}
                      value={form.goals12Months}
                      onChange={(e) => handleChange('goals12Months', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">🚀 What are your goals for the next 3 years?</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Where do you see your business in 3 years? Expansion plans, revenue targets, team size..."
                      rows={4}
                      value={form.goals3Years}
                      onChange={(e) => handleChange('goals3Years', e.target.value)}
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">👷 How many jobs will the business create?</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 10 direct jobs"
                        value={form.jobsCreated}
                        onChange={(e) => handleChange('jobsCreated', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">💰 How will this funding help your business grow?</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Explain the impact this funding will have on your business growth..."
                      rows={4}
                      value={form.fundingImpact}
                      onChange={(e) => handleChange('fundingImpact', e.target.value)}
                    />
                  </div>
                </div>

                {/* Final summary before generating */}
                <div className={styles.finalSummary}>
                  <h4>✅ Ready to Generate Your Document</h4>
                  <p>Your answers will be transformed into a professional {template.title} with 17+ sections.</p>
                  <ul className={styles.summaryList}>
                    <li><strong>Business:</strong> {form.businessName || 'Not entered'}</li>
                    <li><strong>Funding Sought:</strong> {form.amountNeeded ? `₦${parseFloat(form.amountNeeded.replace(/,/g, '')).toLocaleString('en-NG')}` : 'Not entered'}</li>
                    <li><strong>Template:</strong> {template.title}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className={styles.formNav}>
              <button
                className="btn btn-ghost"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft size={16} /> Back
              </button>

              <div className={styles.navRight}>
                <button className="btn btn-ghost btn-sm" onClick={saveProgress}>
                  <Save size={14} /> {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  {step === TOTAL_STEPS ? (
                    <>Generate My Document <ArrowRight size={16} /></>
                  ) : (
                    <>Continue <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import styles from './calculator.module.css';

interface CalcInputs {
  monthlyRevenue: string;
  monthlyExpenses: string;
  costOfGoods: string;
  staffSalaries: string;
  rent: string;
  marketing: string;
  otherExpenses: string;
  startupCapital: string;
  fundingAmount: string;
  growthRate: string;
}

const EMPTY: CalcInputs = {
  monthlyRevenue: '', monthlyExpenses: '', costOfGoods: '', staffSalaries: '',
  rent: '', marketing: '', otherExpenses: '', startupCapital: '', fundingAmount: '', growthRate: '',
};

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>(EMPTY);

  const parse = (v: string) => parseFloat(v?.replace(/,/g, '') || '0') || 0;
  const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`;
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;

  const rev = parse(inputs.monthlyRevenue);
  const cogs = parse(inputs.costOfGoods);
  const staff = parse(inputs.staffSalaries);
  const rent = parse(inputs.rent);
  const mkt = parse(inputs.marketing);
  const other = parse(inputs.otherExpenses);
  const growth = parse(inputs.growthRate) / 100;
  const funding = parse(inputs.fundingAmount);
  const capital = parse(inputs.startupCapital);

  const totalMonthlyExp = cogs + staff + rent + mkt + other;
  const grossProfit = rev - cogs;
  const netProfit = rev - totalMonthlyExp;
  const annualRevenue = rev * 12;
  const annualExpenses = totalMonthlyExp * 12;
  const annualProfit = netProfit * 12;
  const profitMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const totalInvestment = capital + funding;
  const breakEvenMonths = netProfit > 0 ? Math.ceil(totalInvestment / netProfit) : 0;
  const annualROI = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;

  // Year 2 & 3 projections with growth
  const yr2Rev = annualRevenue * (1 + growth);
  const yr3Rev = yr2Rev * (1 + growth);
  const yr2Profit = annualProfit * (1 + growth * 1.2);
  const yr3Profit = yr2Profit * (1 + growth * 1.2);

  const set = (field: keyof CalcInputs, value: string) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <Navbar />
      <div className={styles.calcPage}>
        <div className={styles.pageHeader}>
          <div className="container">
            <div className="section-label">Financial Tool</div>
            <h1 className={styles.pageTitle}>Financial Calculator</h1>
            <p className={styles.pageSubtitle}>
              Calculate your business profits, revenue projections, break-even point, and return on investment — all in Nigerian Naira.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.calcLayout}>
            {/* Left: Inputs */}
            <div className={styles.inputsPanel}>
              <div className={styles.panelCard}>
                <h3 className={styles.panelTitle}>📊 Revenue</h3>
                <div className="form-group">
                  <label className="form-label">Expected Monthly Revenue (₦)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.naira}>₦</span>
                    <input className="form-input" type="text" placeholder="e.g. 500,000" value={inputs.monthlyRevenue} onChange={e => set('monthlyRevenue', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.panelCard}>
                <h3 className={styles.panelTitle}>💸 Monthly Expenses</h3>
                <div className={styles.expensesList}>
                  {[
                    { label: 'Cost of Goods / Production', key: 'costOfGoods', placeholder: '150,000' },
                    { label: 'Staff Salaries', key: 'staffSalaries', placeholder: '100,000' },
                    { label: 'Rent & Utilities', key: 'rent', placeholder: '50,000' },
                    { label: 'Marketing Budget', key: 'marketing', placeholder: '30,000' },
                    { label: 'Other Expenses', key: 'otherExpenses', placeholder: '20,000' },
                  ].map((item) => (
                    <div className="form-group" key={item.key}>
                      <label className="form-label">{item.label} (₦)</label>
                      <div className={styles.inputWrap}>
                        <span className={styles.naira}>₦</span>
                        <input
                          className="form-input"
                          type="text"
                          placeholder={item.placeholder}
                          value={inputs[item.key as keyof CalcInputs]}
                          onChange={e => set(item.key as keyof CalcInputs, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.panelCard}>
                <h3 className={styles.panelTitle}>🏦 Capital & Funding</h3>
                <div className="form-group">
                  <label className="form-label">Startup Capital / Existing Capital (₦)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.naira}>₦</span>
                    <input className="form-input" type="text" placeholder="e.g. 1,000,000" value={inputs.startupCapital} onChange={e => set('startupCapital', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Funding Amount Sought (₦)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.naira}>₦</span>
                    <input className="form-input" type="text" placeholder="e.g. 5,000,000" value={inputs.fundingAmount} onChange={e => set('fundingAmount', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Annual Growth Rate (%)</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.naira}>%</span>
                    <input className="form-input" type="text" placeholder="e.g. 30" value={inputs.growthRate} onChange={e => set('growthRate', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className={styles.resultsPanel}>
              <div className={styles.resultsHeader}>
                <TrendingUp size={20} color="var(--color-primary)" />
                <h3>Calculated Results</h3>
              </div>

              {/* Key Metrics */}
              <div className={styles.metricsGrid}>
                {[
                  { label: 'Gross Profit (Monthly)', value: fmt(grossProfit), positive: grossProfit >= 0, icon: '💰' },
                  { label: 'Net Profit (Monthly)', value: fmt(netProfit), positive: netProfit >= 0, icon: '📈' },
                  { label: 'Annual Revenue', value: fmt(annualRevenue), positive: true, icon: '🏆' },
                  { label: 'Annual Profit', value: fmt(annualProfit), positive: annualProfit >= 0, icon: '✨' },
                  { label: 'Gross Margin', value: fmtPct(grossMargin), positive: grossMargin >= 0, icon: '📊' },
                  { label: 'Net Profit Margin', value: fmtPct(profitMargin), positive: profitMargin >= 0, icon: '🎯' },
                ].map((metric, i) => (
                  <div key={i} className={`${styles.metricCard} ${metric.positive ? styles.metricPositive : styles.metricNegative}`}>
                    <span className={styles.metricIcon}>{metric.icon}</span>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <span className={styles.metricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>

              {/* Investment Return */}
              {totalInvestment > 0 && (
                <div className={styles.investmentCard}>
                  <h4 className={styles.investmentTitle}>Investment Analysis</h4>
                  <div className={styles.investmentGrid}>
                    <div className={styles.investmentItem}>
                      <span className={styles.investLabel}>Total Investment</span>
                      <span className={styles.investValue}>{fmt(totalInvestment)}</span>
                    </div>
                    <div className={styles.investmentItem}>
                      <span className={styles.investLabel}>Break-even Period</span>
                      <span className={styles.investValue} style={{ color: breakEvenMonths > 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                        {breakEvenMonths > 0 ? `${breakEvenMonths} months` : 'N/A'}
                      </span>
                    </div>
                    <div className={styles.investmentItem}>
                      <span className={styles.investLabel}>Annual ROI</span>
                      <span className={styles.investValue} style={{ color: annualROI >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {fmtPct(annualROI)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3-Year Projections */}
              {growth > 0 && annualRevenue > 0 && (
                <div className={styles.projectionsCard}>
                  <h4 className={styles.investmentTitle}>📅 3-Year Revenue Projections</h4>
                  <table className={styles.projTable}>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Year 1</strong></td>
                        <td>{fmt(annualRevenue)}</td>
                        <td style={{ color: annualProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{fmt(annualProfit)}</td>
                      </tr>
                      <tr>
                        <td><strong>Year 2</strong></td>
                        <td>{fmt(yr2Rev)}</td>
                        <td style={{ color: yr2Profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{fmt(yr2Profit)}</td>
                      </tr>
                      <tr>
                        <td><strong>Year 3</strong></td>
                        <td>{fmt(yr3Rev)}</td>
                        <td style={{ color: yr3Profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{fmt(yr3Profit)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {netProfit < 0 && rev > 0 && (
                <div className="alert alert-warning">
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <span>Your expenses exceed revenue. Consider reducing costs or increasing revenue to achieve profitability.</span>
                </div>
              )}

              <div className={styles.calcCTA}>
                <p>Include these projections in your business plan</p>
                <a href="/create/general-business-plan" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Create My Business Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

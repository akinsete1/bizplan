'use client';

import Link from 'next/link';
import { ArrowRight, Download, TrendingUp, CheckCircle2 } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background blobs */}
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.bgBlob3} />

      <div className="container">
        <div className={styles.heroInner}>
          {/* Left: Text Content */}
          <div className={styles.heroContent}>
            <div className={`badge badge-primary ${styles.heroBadge} animate-fade-in-up`}>
              <span className={styles.badgeDot} />
              🇳🇬 Built for Nigerian Entrepreneurs
            </div>

            <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
              Create a Professional<br />
              <span className={styles.titleGreen}>Business Plan</span><br />
              in Minutes.
            </h1>

            <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
              Get funding-ready business plans, grant proposals, loan applications, and business documents designed for Nigerian entrepreneurs — banks, grants, investors, and more.
            </p>

            <div className={`${styles.heroCTAs} animate-fade-in-up delay-3`}>
              <Link href="/create" className="btn btn-primary btn-lg">
                Create My Business Plan
                <ArrowRight size={18} />
              </Link>
              <Link href="/templates" className="btn btn-outline btn-lg">
                Explore Templates
              </Link>
            </div>

            <div className={`${styles.heroTrust} animate-fade-in-up delay-4`}>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>No writing experience needed</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Download PDF & Word</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>20+ document types</span>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className={`${styles.heroVisual} animate-fade-in-up delay-2`}>
            <div className={styles.dashboardCard}>
              {/* Card Header */}
              <div className={styles.dashHeader}>
                <div className={styles.dashHeaderLeft}>
                  <div className={styles.dashAvatar}>AC</div>
                  <div>
                    <div className={styles.dashName}>Adeola Cosmas</div>
                    <div className={styles.dashPlan}>Business Plan — In Progress</div>
                  </div>
                </div>
                <span className="badge badge-success">75% Complete</span>
              </div>

              {/* Progress */}
              <div className={styles.dashProgress}>
                <div className={styles.dashProgressLabel}>
                  <span>Document Progress</span>
                  <strong>75%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Info Grid */}
              <div className={styles.dashGrid}>
                <div className={styles.dashInfo}>
                  <span className={styles.dashInfoLabel}>Business Name</span>
                  <span className={styles.dashInfoValue}>GreenLeaf Farms Ltd</span>
                </div>
                <div className={styles.dashInfo}>
                  <span className={styles.dashInfoLabel}>Industry</span>
                  <span className={styles.dashInfoValue}>Agriculture</span>
                </div>
                <div className={styles.dashInfo}>
                  <span className={styles.dashInfoLabel}>Funding Goal</span>
                  <span className={styles.dashInfoValue} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>₦5,000,000</span>
                </div>
                <div className={styles.dashInfo}>
                  <span className={styles.dashInfoLabel}>Document Type</span>
                  <span className={styles.dashInfoValue}>Grant Proposal</span>
                </div>
              </div>

              {/* Revenue Chart Visual */}
              <div className={styles.revenueSection}>
                <div className={styles.revenueLabelRow}>
                  <span className={styles.dashInfoLabel}>Revenue Projection</span>
                  <TrendingUp size={16} color="var(--color-success)" />
                </div>
                <div className={styles.revenueAmount}>₦12,400,000 <span>/year</span></div>
                <div className={styles.revenueBar}>
                  {[45, 58, 52, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                    <div
                      key={i}
                      className={styles.revenueBarItem}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.dashActions}>
                <button className="btn btn-primary btn-sm">
                  <Download size={14} />
                  Download PDF
                </button>
                <button className="btn btn-outline btn-sm">Continue Editing</button>
              </div>
            </div>

            {/* Floating badge */}
            <div className={styles.floatingBadge1}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Bank-ready document</span>
            </div>
            <div className={styles.floatingBadge2}>
              <span className={styles.badgeNumber}>+2,400</span>
              <span>entrepreneurs helped</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

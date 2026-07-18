import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.bgDecor1} />
      <div className={styles.bgDecor2} />
      <div className="container">
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>
            <div className={styles.ctaTag}>🚀 Get Started Today</div>
            <h2 className={styles.ctaTitle}>
              Turn Your Business Idea Into a<br />
              <span className={styles.ctaHighlight}>Funding-Ready Plan.</span>
            </h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of Nigerian entrepreneurs who have created professional business documents with BizPlan Nigeria.
            </p>
          </div>
          <div className={styles.ctaButtons}>
            <Link href="/create" className="btn btn-accent btn-lg">
              Create My Business Plan
              <ArrowRight size={18} />
            </Link>
            <Link href="/templates" className="btn btn-outline-white btn-lg">
              Browse Templates
            </Link>
          </div>
          <div className={styles.ctaStats}>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>2,400+</span>
              <span className={styles.ctaStatLabel}>Documents Created</span>
            </div>
            <div className={styles.ctaStatDivider} />
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>20+</span>
              <span className={styles.ctaStatLabel}>Templates Available</span>
            </div>
            <div className={styles.ctaStatDivider} />
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNum}>₦2,500</span>
              <span className={styles.ctaStatLabel}>Starting From</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

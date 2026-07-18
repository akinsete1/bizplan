import Link from 'next/link';
import { ArrowRight, Eye, Star } from 'lucide-react';
import styles from './TemplatePreview.module.css';

const FEATURED_TEMPLATES = [
  {
    id: 'general-business-plan',
    title: 'General Business Plan',
    industry: 'All Industries',
    description: 'Complete business plan suitable for any industry. Perfect for bank loans and investor pitches.',
    price: '₦2,500',
    popular: true,
    emoji: '📋',
    color: '#0A5C36',
  },
  {
    id: 'grant-proposal',
    title: 'Grant Proposal',
    industry: 'NGO / Government',
    description: 'Professional grant proposal template for government grants and NGO funding applications.',
    price: '₦2,500',
    popular: true,
    emoji: '🏛️',
    color: '#F5A623',
  },
  {
    id: 'agricultural-business-plan',
    title: 'Agricultural Business Plan',
    industry: 'Agriculture',
    description: 'Tailored for farmers, agro-processors, and agribusinesses seeking BOI or agricultural grants.',
    price: '₦2,500',
    popular: false,
    emoji: '🌾',
    color: '#10b981',
  },
  {
    id: 'tony-elumelu-proposal',
    title: 'Tony Elumelu Programme Plan',
    industry: 'Startup / SME',
    description: 'Optimized for the Tony Elumelu Foundation Entrepreneurship Programme application.',
    price: '₦2,500',
    popular: true,
    emoji: '🚀',
    color: '#3b82f6',
  },
  {
    id: 'bank-loan-proposal',
    title: 'Bank Loan Proposal',
    industry: 'Finance / Banking',
    description: 'Professional loan proposal for SME loans, business expansion, or equipment financing.',
    price: '₦2,500',
    popular: false,
    emoji: '🏦',
    color: '#8b5cf6',
  },
  {
    id: 'fashion-business-plan',
    title: 'Fashion Business Plan',
    industry: 'Fashion & Beauty',
    description: 'Comprehensive plan for fashion designers, boutiques, and clothing businesses.',
    price: '₦2,500',
    popular: false,
    emoji: '👗',
    color: '#ec4899',
  },
];

export default function TemplatePreview() {
  return (
    <section className={`section ${styles.templateSection}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div>
            <div className="section-label">Template Marketplace</div>
            <h2 className="section-title">
              Ready-Made Templates for<br />
              <span>Every Nigerian Business</span>
            </h2>
            <p className="section-subtitle">
              Choose from 20+ professionally designed templates built for Nigerian funding programmes.
            </p>
          </div>
          <Link href="/templates" className={`btn btn-outline ${styles.viewAllBtn}`}>
            View All Templates
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Template Grid */}
        <div className={styles.templateGrid}>
          {FEATURED_TEMPLATES.map((template) => (
            <div key={template.id} className={styles.templateCard}>
              {template.popular && (
                <div className={styles.popularBadge}>
                  <Star size={10} fill="white" />
                  Popular
                </div>
              )}

              <div
                className={styles.templateIcon}
                style={{ background: `${template.color}15` }}
              >
                <span className={styles.templateEmoji}>{template.emoji}</span>
              </div>

              <div className={styles.templateIndustry}>{template.industry}</div>
              <h3 className={styles.templateTitle}>{template.title}</h3>
              <p className={styles.templateDesc}>{template.description}</p>

              <div className={styles.templateFooter}>
                <span className={styles.templatePrice}>{template.price}</span>
                <div className={styles.templateActions}>
                  <button className={`btn btn-ghost btn-sm ${styles.previewBtn}`}>
                    <Eye size={14} />
                    Preview
                  </button>
                  <Link
                    href={`/create/${template.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCTA}>
          <p>Can&apos;t find what you need? We have 20+ templates across all industries.</p>
          <Link href="/templates" className="btn btn-primary">
            Browse All Templates
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

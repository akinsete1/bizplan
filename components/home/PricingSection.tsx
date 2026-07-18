import Link from 'next/link';
import { Check, Zap } from 'lucide-react';
import styles from './PricingSection.module.css';

const PLANS = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Get started and explore the platform.',
    features: [
      'Access to 3 basic templates',
      'Basic document builder',
      'Watermarked PDF download',
      'Financial calculator',
    ],
    cta: 'Start Free',
    href: '/register',
    featured: false,
  },
  {
    name: 'Starter',
    price: '₦2,500',
    period: 'per document',
    description: 'For entrepreneurs who need one great document.',
    features: [
      'Premium template access',
      'Full document generation',
      'PDF download (no watermark)',
      'Word document download',
      'Financial projections',
    ],
    cta: 'Buy Document',
    href: '/register?plan=starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₦7,500',
    period: 'per month',
    description: 'For entrepreneurs who need multiple documents.',
    features: [
      'Unlimited document creation',
      'All 20+ premium templates',
      'Grant proposal builder',
      'Loan proposal builder',
      'Financial calculator',
      'No watermarks',
      'Priority email support',
    ],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    price: '₦25,000',
    period: 'per month',
    description: 'For businesses and consultants managing multiple clients.',
    features: [
      'Everything in Pro',
      'Business branding & logo',
      'Team member access',
      'Custom document colors',
      'API access',
      'Dedicated account manager',
      'Priority phone support',
    ],
    cta: 'Start Business',
    href: '/register?plan=business',
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section className={`section ${styles.pricingSection}`}>
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="section-label">Pricing</div>
          <h2 className="section-title">
            Simple, Transparent <span>Pricing</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Affordable plans designed for Nigerian entrepreneurs. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
              {plan.featured && (
                <div className="pricing-badge">
                  <Zap size={12} style={{ display: 'inline' }} /> {plan.badge}
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className="pricing-price">
                  {plan.price}
                  <span className="pricing-period"> / {plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="pricing-feature">
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className={styles.pricingNote}>
          💳 Payments processed securely via Paystack. You can cancel anytime.
        </p>
      </div>
    </section>
  );
}

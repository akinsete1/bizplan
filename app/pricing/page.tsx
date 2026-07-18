import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Zap, Shield, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlanCard from '@/components/payment/PlanCard';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing – BizPlan Nigeria',
  description: 'Simple, affordable pricing for Nigerian entrepreneurs. Free plan, per-document, and monthly subscription options.',
};

const PLANS = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Try the platform and explore available templates.',
    features: [
      'Access to 3 basic templates',
      'Basic document builder',
      'Watermarked PDF download',
      'Financial calculator access',
      'Blog & resources access',
    ],
    notIncluded: ['Premium templates', 'No watermark', 'Word download', 'Grant builder'],
    cta: 'Get Started Free',
    href: '/register',
    featured: false,
  },
  {
    name: 'Starter',
    price: '₦2,500',
    period: 'per document',
    description: 'Perfect for one-time document needs.',
    features: [
      '1 premium template',
      'Full document generation',
      'PDF download (no watermark)',
      'Word document download',
      'Financial projections included',
      'Valid for 30 days',
    ],
    notIncluded: ['Unlimited documents', 'Grant builder', 'Loan builder'],
    cta: 'Buy Single Document',
    href: '/register?plan=starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₦7,500',
    period: 'per month',
    description: 'For entrepreneurs creating multiple documents.',
    features: [
      'Unlimited document creation',
      'All 20+ premium templates',
      'Grant proposal builder',
      'Loan proposal builder',
      'Financial calculator',
      'No watermarks on downloads',
      'Priority email support',
      'Save & resume later',
    ],
    notIncluded: [],
    cta: 'Start Pro Plan',
    href: '/register?plan=pro',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    price: '₦25,000',
    period: 'per month',
    description: 'For consultants and businesses managing multiple clients.',
    features: [
      'Everything in Pro',
      'Business branding & logo upload',
      'Up to 5 team members',
      'Custom document colours',
      'Client document management',
      'API access',
      'Dedicated account manager',
      'Priority phone support',
    ],
    notIncluded: [],
    cta: 'Start Business Plan',
    href: '/register?plan=business',
    featured: false,
  },
];

const FAQS = [
  {
    q: 'Do I need a subscription to use BizPlan Nigeria?',
    a: 'No. You can create an account for free and access basic templates. You only pay when you need premium features or want to download a watermark-free document.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all Nigerian payment methods through Paystack — including bank cards, bank transfers, and USSD. We also support Flutterwave.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. You can cancel your Pro or Business subscription at any time. You will continue to have access until the end of your billing period.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes. All payments are processed securely by Paystack, Nigeria\'s leading payment gateway. We never store your card details.',
  },
  {
    q: 'Can I get a refund if I am not satisfied?',
    a: 'Yes. We offer a 7-day refund policy for first-time subscribers. Contact us at hello@bizplannigeria.com within 7 days of payment.',
  },
  {
    q: 'Do you offer discounts for NGOs or students?',
    a: 'Yes. We offer special pricing for verified NGOs, students, and NYSC corps members. Contact us to learn more.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className={styles.pricingHero}>
          <div className="container text-center">
            <div className="section-label">Pricing</div>
            <h1 className={styles.heroTitle}>
              Affordable Plans for<br />
              <span>Nigerian Entrepreneurs</span>
            </h1>
            <p className={styles.heroSubtitle}>
              From free to pro — choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="container section">
          <div className={styles.plansGrid}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                notIncluded={plan.notIncluded}
                cta={plan.cta}
                featured={plan.featured}
                badge={plan.badge}
                priceValue={plan.name === 'Free' ? 0 : plan.name === 'Starter' ? 2500 : plan.name === 'Pro' ? 7500 : 25000}
              />
            ))}
          </div>

          {/* Trust Badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustBadge}>
              <Shield size={18} color="var(--color-primary)" />
              <span>Secure Payments via Paystack</span>
            </div>
            <div className={styles.trustBadge}>
              <CreditCard size={18} color="var(--color-primary)" />
              <span>Cancel Anytime</span>
            </div>
            <div className={styles.trustBadge}>
              <Check size={18} color="var(--color-primary)" />
              <span>7-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            </div>
            <div className={styles.faqGrid}>
              {FAQS.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h4 className={styles.faqQ}>{faq.q}</h4>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={styles.pricingCTA}>
          <div className="container text-center">
            <h2 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Start Creating for Free Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 'var(--space-xl)' }}>
              No credit card required. Create your free account and explore the platform.
            </p>
            <Link href="/register" className="btn btn-accent btn-lg">Get Started Free</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

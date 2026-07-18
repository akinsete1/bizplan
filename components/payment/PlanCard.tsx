'use client';

import { useState } from 'react';
import CheckoutModal from '@/components/payment/CheckoutModal';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
  priceValue: number; // The actual numeric value for Paystack
}

export default function PlanCard({
  name,
  price,
  period,
  description,
  features,
  notIncluded,
  cta,
  featured,
  badge,
  priceValue
}: PlanCardProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleCtaClick = () => {
    if (priceValue === 0) {
      if (!user) {
        router.push('/register');
      } else {
        router.push('/templates');
      }
    } else {
      if (!user) {
         // Redirect to login but pass the plan they wanted so we could ideally bring them back
         router.push(`/login?redirect=/pricing`);
      } else {
        setIsCheckoutOpen(true);
      }
    }
  };

  return (
    <>
      <div className={`pricing-card ${featured ? 'featured' : ''}`}>
        {featured && badge && (
          <div className="pricing-badge">
            <svg style={{ display: 'inline', width: 12, height: 12, marginRight: 4 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            {badge}
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
            {name}
          </div>
          <div className="pricing-price">
            {price}
            <span className="pricing-period"> / {period}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginTop: 'var(--space-sm)' }}>
            {description}
          </p>
        </div>

        <ul className="pricing-features">
          {features.map((f, i) => (
            <li key={i} className="pricing-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>{f}</span>
            </li>
          ))}
          {notIncluded.map((f, i) => (
            <li key={`not-${i}`} className="pricing-feature" style={{ opacity: 0.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span style={{ textDecoration: 'line-through' }}>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleCtaClick}
          className={`btn ${featured ? 'btn-primary' : 'btn-outline'}`}
          style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
        >
          {cta}
        </button>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={name}
        price={priceValue}
        features={features}
        type={name === 'Starter' ? 'document' : 'subscription'}
        onSuccess={(ref) => {
          router.push(`/payment/success?ref=${ref}`);
        }}
      />
    </>
  );
}

'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import PaystackButton from './PaystackButton';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number; // in NGN
  features: string[];
  type: 'subscription' | 'document';
  documentId?: string;
  onSuccess: (reference: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  planName,
  price,
  features,
  type,
  documentId,
  onSuccess,
}: CheckoutModalProps) {
  const [showManual, setShowManual] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Complete Your Purchase</h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--color-primary-50)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {type === 'subscription' ? 'Subscription Plan' : 'Single Document'}
                </div>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>{planName}</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>₦{price.toLocaleString()}</div>
                {type === 'subscription' && <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>per month</div>}
              </div>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--color-text)' }}>What&apos;s included:</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                  <Check size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

          <div className="modal-footer" style={{ flexDirection: 'column', gap: '12px' }}>
            {!showManual ? (
              <>
                <PaystackButton
                  amount={price}
                  metadata={{ plan: planName.toLowerCase(), type, document_id: documentId }}
                  onSuccess={(ref) => {
                    onSuccess(ref);
                    onClose();
                  }}
                  onClose={onClose}
                  text={`Pay ₦${price.toLocaleString()} Securely`}
                  className="btn btn-primary btn-lg"
                />
                <button 
                  className="btn btn-outline btn-lg" 
                  onClick={() => setShowManual(true)}
                >
                  Pay via Bank Transfer
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                   Secured by Paystack
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'left', width: '100%' }}>
                <h5 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--color-text)' }}>Bank Transfer Instructions</h5>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.9375rem' }}>
                  Please transfer <strong>₦{price.toLocaleString()}</strong> to the account below.
                </p>
                <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.9375rem' }}>
                  <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--color-text-light)' }}>Bank:</span> <strong>Guaranty Trust Bank (GTB)</strong></div>
                  <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--color-text-light)' }}>Account Number:</span> <strong style={{ fontSize: '1.125rem', color: 'var(--color-primary)' }}>0123456789</strong></div>
                  <div><span style={{ color: 'var(--color-text-light)' }}>Name:</span> <strong>BizPlan Nigeria Ltd</strong></div>
                </div>
                <a href={`https://wa.me/2348000000000?text=Hello,%20I%20just%20paid%20%E2%82%A6${price.toLocaleString()}%20for%20the%20${planName}%20plan.`} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '12px', background: '#25D366', borderColor: '#25D366' }}>
                  Send Receipt on WhatsApp
                </a>
                <button 
                  className="btn btn-ghost" 
                  style={{ width: '100%' }} 
                  onClick={() => setShowManual(false)}
                >
                  Back to Paystack
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

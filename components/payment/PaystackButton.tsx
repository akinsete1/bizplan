'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { PAYSTACK_PUBLIC_KEY, generateReference } from '@/lib/paystack';

interface PaystackButtonProps {
  amount: number; // in NGN (not kobo)
  email?: string;
  plan?: string; // Paystack Plan ID for subscriptions
  metadata?: Record<string, any>;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  text?: string;
  className?: string;
  disabled?: boolean;
}

export default function PaystackButton({
  amount,
  email,
  plan,
  metadata = {},
  onSuccess,
  onClose,
  text = 'Pay Now',
  className = 'btn btn-primary',
  disabled = false,
}: PaystackButtonProps) {
  const { user } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack Inline Script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const userEmail = email || user?.email;
    
    if (!userEmail) {
      alert('Email is required for payment. Please log in.');
      return;
    }

    if (!isScriptLoaded || !(window as any).PaystackPop) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    const paystack = new (window as any).PaystackPop();
    paystack.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: amount * 100, // Convert to kobo
      ref: generateReference(),
      plan: plan,
      metadata: {
        ...metadata,
        user_id: user?.id,
      },
      onSuccess: (transaction: any) => {
        if (onSuccess) onSuccess(transaction.reference);
      },
      onCancel: () => {
        if (onClose) onClose();
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || !isScriptLoaded}
      className={className}
    >
      {text}
    </button>
  );
}

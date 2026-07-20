import { useState, useEffect } from 'react';

interface PaystackOptions {
  email: string;
  amount: number; // in kobo
  reference?: string;
  plan?: string; // Optional Paystack Plan ID for subscriptions
  metadata?: Record<string, any>;
  onSuccess: (response: { reference: string }) => void;
  onCancel?: () => void;
}

export function usePaystack() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);
    } else {
      setIsReady(true);
    }
  }, []);

  const initializePayment = (options: PaystackOptions) => {
    if (!isReady || !(window as any).PaystackPop) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    const paystack = new (window as any).PaystackPop();
    
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: options.email,
      amount: options.amount,
      reference: options.reference || `bp_${Math.floor(Math.random() * 1000000000 + 1)}`,
      plan: options.plan,
      metadata: options.metadata || {},
      onSuccess: options.onSuccess,
      onCancel: () => {
        if (options.onCancel) options.onCancel();
      },
    });
  };

  return { initializePayment, isReady };
}

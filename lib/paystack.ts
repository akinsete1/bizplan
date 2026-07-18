// lib/paystack.ts — Paystack helpers
import crypto from 'crypto';

export interface PaystackInitializeOptions {
  email: string;
  amount: number; // Amount in kobo (NGN x 100)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Generate a random reference
export const generateReference = () => {
  return `BZP-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

/**
 * Validates a Paystack webhook signature
 */
export const verifyWebhookSignature = (signature: string, payload: string) => {
  const expectedSignature = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY || '')
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
};

/**
 * Initializes a transaction on the server side (Alternative to inline popup)
 */
export const initializeTransaction = async (options: PaystackInitializeOptions) => {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    throw error;
  }
};

/**
 * Verifies a transaction on the server side
 */
export const verifyTransaction = async (reference: string) => {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error);
    throw error;
  }
};

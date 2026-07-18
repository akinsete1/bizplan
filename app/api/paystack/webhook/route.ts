import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/paystack';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-paystack-signature');
    const rawBody = await req.text();

    if (!signature || !verifyWebhookSignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const supabase = createServerClient();

    // Handle successful payment
    if (event.event === 'charge.success') {
      const data = event.data;
      const metadata = data.metadata || {};

      const userId = String(metadata.user_id || data.customer.email);

      // 1. Log payment in database
      await (supabase as any).from('payments').insert({
        user_id: userId,
        paystack_reference: data.reference,
        paystack_transaction_id: String(data.id),
        amount: data.amount,
        currency: data.currency,
        plan: metadata.plan,
        document_id: metadata.document_id,
        status: 'successful',
        metadata: data,
      });

      // 2. Handle specific payment types
      if (metadata.type === 'subscription' && metadata.plan) {
        // Update or insert subscription
        await (supabase as any).from('subscriptions').upsert({
          user_id: userId,
          plan: metadata.plan,
          status: 'active',
          current_period_start: new Date().toISOString(),
          // Default to 30 days, should ideally sync with Paystack subscription dates if using Paystack Subscriptions
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paystack_customer_code: data.customer.customer_code,
        });
        
        // Update user profile plan
        await (supabase as any).from('profiles').update({ plan: metadata.plan }).eq('id', metadata.user_id);
      } else if (metadata.type === 'document' && metadata.document_id) {
        // Mark document as paid
        await (supabase as any).from('documents').update({ is_paid: true }).eq('id', metadata.document_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

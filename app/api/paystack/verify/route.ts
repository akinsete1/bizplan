import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase client with the service role key to bypass RLS for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful or not found' }, { status: 400 });
    }

    const transaction = data.data;
    const documentId = transaction.metadata?.document_id;
    const plan = transaction.metadata?.plan;
    const userId = transaction.metadata?.user_id || transaction.customer?.email; // Ideally metadata has user_id

    // Log the payment in the payments table
    await supabaseAdmin.from('payments').insert({
      user_id: transaction.metadata?.user_id, // Might be undefined if not passed, but we should pass it
      paystack_reference: reference,
      amount: transaction.amount / 100, // convert kobo back to NGN
      document_id: documentId,
      plan: plan,
    });

    // If this payment was for a specific document, unlock it
    if (documentId) {
      const { error: updateError } = await supabaseAdmin
        .from('documents')
        .update({ is_paid: true })
        .eq('id', documentId);

      if (updateError) {
        console.error('Failed to unlock document:', updateError);
        return NextResponse.json({ error: 'Payment successful but failed to unlock document' }, { status: 500 });
      }
    }

    // If this payment was for a subscription plan
    if (plan) {
       // Ideally we'd calculate end_date based on period. Simple implementation: +30 days
       const endDate = new Date();
       endDate.setDate(endDate.getDate() + 30);
       
       await supabaseAdmin.from('subscriptions').upsert({
         user_id: transaction.metadata?.user_id,
         plan: plan,
         status: 'active',
         current_period_end: endDate.toISOString(),
       }, { onConflict: 'user_id' });
    }

    return NextResponse.json({ success: true, message: 'Payment verified and processed successfully' });

  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role for admin bypass
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      order_id, 
      transaction_status, 
      fraud_status, 
      signature_key, 
      gross_amount,
      status_code,
      custom_field1: userId,
      custom_field2: planId 
    } = body;

    // 1. Verify Signature for Security
    // Formula: SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder';
    const payload = order_id + status_code + gross_amount + serverKey;
    const expectedSignature = crypto.createHash('sha512').update(payload).digest('hex');

    if (signature_key !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    console.log(`Webhook received for Order: ${order_id}, Status: ${transaction_status}`);

    // 2. Handle Payment Statuses
    // Reference: https://docs.midtrans.com/en/after-payment/http-notification
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      if (fraud_status === 'accept' || transaction_status === 'settlement') {
        
        // --- SUCCESS PAYMENT ---
        
        // A. Update Profile Subscription
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_plan: planId,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        // B. Update Invoice Status
        await supabaseAdmin
          .from('invoices')
          .update({ status: 'paid' })
          .eq('order_id', order_id);
          
        console.log(`User ${userId} successfully upgraded to ${planId}`);
      }
    } else if (transaction_status === 'expire' || transaction_status === 'cancel' || transaction_status === 'deny') {
      // --- FAILED / EXPIRED ---
      await supabaseAdmin
        .from('invoices')
        .update({ status: 'failed' })
        .eq('order_id', order_id);
    }

    return NextResponse.json({ message: 'OK' });

  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

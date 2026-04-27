import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { createClient } from '@/lib/supabase/server';
import { PLAN_PRICES, PlanType } from '@/lib/planLimits';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId || !PLAN_PRICES[planId as PlanType]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const amount = PLAN_PRICES[planId as PlanType];
    const orderId = `SUBS-${planId.toUpperCase()}-${user.id.slice(0, 8)}-${Date.now()}`;

    // Create Midtrans Transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        email: user.email,
      },
      item_details: [
        {
          id: planId,
          price: amount,
          quantity: 1,
          name: `NusaEstate ${planId.toUpperCase()} Subscription`,
        },
      ],
      // Add custom field to store user info for webhook
      custom_field1: user.id,
      custom_field2: planId,
    };

    const transaction = await snap.createTransaction(parameter);

    // Optional: Log invoice to database with status 'pending'
    await supabase.from('invoices').insert({
      user_id: user.id,
      order_id: orderId,
      amount: amount,
      plan_type: planId,
      status: 'pending',
    });

    return NextResponse.json({ 
      token: transaction.token,
      redirect_url: transaction.redirect_url 
    });

  } catch (error: any) {
    console.error('Midtrans Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

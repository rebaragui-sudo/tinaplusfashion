import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('InfinitePay Webhook received:', body);

    // The order_nsu is our orderId (UUID)
    const { order_nsu, status, transaction_nsu } = body;

    if (!order_nsu) {
      return NextResponse.json({ error: 'order_nsu not found' }, { status: 400 });
    }

    const supabase = createServerClient();

    // InfinitePay documentation says webhook is sent upon payment approval
    // We should update the order status to 'paid' or similar
    // Note: You might want to verify the payment amount or status here if provided
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        // Optional: store transaction details
        tracking_number: transaction_nsu // Using this field temporarily or add a new one
      })
      .eq('id', order_nsu);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ error: 'Internal error updating order' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

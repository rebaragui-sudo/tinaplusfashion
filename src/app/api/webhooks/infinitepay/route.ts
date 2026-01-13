import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('InfinitePay Webhook received:', body);

    // The order_nsu is our orderId (UUID)
    const { order_nsu, transaction_nsu, invoice_slug, amount, paid_amount } = body;

    if (!order_nsu) {
      console.error('Webhook error: order_nsu missing');
      return NextResponse.json({ error: 'order_nsu not found' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Atualiza o status do pedido para 'pago' (ou 'paid' dependendo da convenção do seu banco)
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'pago',
        updated_at: new Date().toISOString()
      })
      .eq('id', order_nsu);

    if (error) {
      console.error('Error updating order status in database:', error);
      // Retornamos 400 para que a InfinitePay tente enviar o webhook novamente depois
      return NextResponse.json({ error: 'Internal error updating order' }, { status: 400 });
    }

    console.log(`Order ${order_nsu} updated to paid via webhook.`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('InfinitePay Webhook received:', JSON.stringify(body, null, 2));

    // O webhook da InfinitePay dispara SOMENTE quando o pagamento é confirmado.
    // Ele não envia campo "status" — a presença do webhook já indica pagamento aprovado.
    // O order_nsu é o ID do pedido que enviamos na criação do link.
    const orderId = body.order_nsu || body.order_id || body.external_id || body.reference_id;

    // Se tiver campo status, verificamos se é negativo para ignorar
    const status = body.status || body.payment_status || body.transaction_status;
    const REJECTED_STATUSES = ['failed', 'rejected', 'cancelled', 'canceled', 'expired', 'refunded', 'chargeback'];
    if (status && REJECTED_STATUSES.includes(String(status).toLowerCase())) {
      console.log(`Webhook: status '${status}' indica pagamento não aprovado. Ignorando.`);
      return NextResponse.json({ success: true, message: 'Payment not approved' }, { status: 200 });
    }

    if (!orderId) {
      console.error('Webhook error: orderId (order_nsu) ausente. Body:', JSON.stringify(body));
      return NextResponse.json({ error: 'orderId not found', body }, { status: 200 });
    }

    console.log(`Webhook: atualizando pedido ${orderId} para pago`);

    const supabase = createServerClient();

    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error(`Webhook: pedido ${orderId} não encontrado. Erro:`, fetchError);
      return NextResponse.json({ error: 'Order not found', orderId }, { status: 200 });
    }

    if (existingOrder.status === 'pago') {
      console.log(`Webhook: pedido ${orderId} já está pago.`);
      return NextResponse.json({ success: true, message: 'Order already paid' }, { status: 200 });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'pago' })
      .eq('id', orderId);

    if (updateError) {
      console.error('Webhook: erro ao atualizar pedido no banco:', updateError);
      return NextResponse.json({ error: 'Internal error updating order' }, { status: 400 });
    }

    console.log(`Webhook: pedido ${orderId} atualizado para 'pago' com sucesso.`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

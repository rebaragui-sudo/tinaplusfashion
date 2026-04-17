import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// Status da InfinitePay que indicam pagamento aprovado
const PAID_STATUSES = ['paid', 'approved', 'captured', 'succeeded', 'complete', 'completed'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('InfinitePay Webhook received:', JSON.stringify(body, null, 2));

    // A InfinitePay pode enviar o orderId em diferentes campos
    const orderId = body.order_nsu || body.order_id || body.external_id || body.reference_id;
    const status = body.status || body.payment_status || body.transaction_status;

    if (!orderId) {
      console.error('Webhook error: orderId missing. Body:', body);
      // Retornar 200 para não causar reenvios desnecessários
      return NextResponse.json({ error: 'orderId not found', body }, { status: 200 });
    }

    console.log(`Webhook: orderId=${orderId}, status=${status}`);

    // Só atualiza para pago se o status for de aprovação
    const isPaid = !status || PAID_STATUSES.includes(String(status).toLowerCase());

    if (!isPaid) {
      console.log(`Webhook: status '${status}' não é de pagamento aprovado. Ignorando atualização.`);
      return NextResponse.json({ success: true, message: 'Status not a payment confirmation' }, { status: 200 });
    }

    const supabase = createServerClient();

    // Tenta atualizar pelo ID direto
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

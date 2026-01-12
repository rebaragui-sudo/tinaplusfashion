import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items, customer, totalPrice, redirectUrl } = body;

    const infiniteTag = process.env.INFINITEPAY_TAG;

    // Se o tag não estiver configurado ou for o padrão, retornamos um link de simulação para permitir testes
    if (!infiniteTag || infiniteTag === 'seu-usuario-sem-o-cifrao') {
      console.warn('INFINITEPAY_TAG não configurado. Usando modo de simulação.');
      return NextResponse.json({
        url: `${redirectUrl}&mock=true`,
        isMock: true
      });
    }

    // InfinitePay expects price in cents (centavos)
    const infinitePayItems = items.map((item: any) => ({
      description: item.name,
      quantity: item.quantity || 1,
      price: Math.round((item.price || 0) * 100),
    }));

    // Add shipping as an item if applicable
    if (body.shippingPrice > 0) {
      infinitePayItems.push({
        description: 'Frete',
        quantity: 1,
        price: Math.round(body.shippingPrice * 100),
      });
    }

    const payload = {
      infinite_tag: infiniteTag,
      items: infinitePayItems,
      order_nsu: orderId,
      customer: {
        name: customer.nome,
        email: customer.email || 'cliente@exemplo.com', // fallback if email not provided
        phone: customer.celular.replace(/\D/g, ''),
        document: customer.cpf.replace(/\D/g, ''),
      },
      redirect_url: redirectUrl,
    };

    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('InfinitePay API Error:', data);
      return NextResponse.json(
        { error: 'Erro ao gerar link de pagamento na InfinitePay', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('InfinitePay Checkout Error:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor', message: error.message },
      { status: 500 }
    );
  }
}

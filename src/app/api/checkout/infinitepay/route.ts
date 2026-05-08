import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items, customer, totalPrice, redirectUrl, shippingMethod } = body;

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
      handle: infiniteTag,
      items: infinitePayItems,
      itens: infinitePayItems, // Tentando os dois nomes de campo já que a documentação diz 'itens' mas o erro diz 'items'
      order_nsu: orderId,
      customer: {
        name: customer.nome,
        email: customer.email || `cliente+${orderId?.slice(0,8) || 'loja'}@tinaplusfashion.com.br`,
        phone_number: (customer.celular || '').replace(/\D/g, ''),
      },
      address: shippingMethod !== 'onibus' && customer.cep ? {
        cep: customer.cep.replace(/\D/g, ''),
        street: customer.endereco,
        neighborhood: customer.bairro || '',
        number: customer.numero,
        complement: customer.complemento || '',
      } : undefined,
      redirect_url: redirectUrl,
      webhook_url: 'https://tinaplusfashion.com.br/api/webhooks/infinitepay',
    };

    console.log('Enviando payload para InfinitePay:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Resposta InfinitePay:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('InfinitePay API Error:', data);
      return NextResponse.json(
        { error: 'Erro ao gerar link de pagamento na InfinitePay', details: data },
        { status: response.status }
      );
    }

    // InfinitePay pode retornar a URL em campos diferentes
    const checkoutUrl = data.url || data.checkout_url || data.link || data.payment_link || data.checkout_link;
    if (!checkoutUrl) {
      console.error('InfinitePay não retornou URL de checkout:', data);
      return NextResponse.json(
        { error: 'InfinitePay não retornou link de pagamento', details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...data, url: checkoutUrl });
  } catch (error: any) {
    console.error('InfinitePay Checkout Error:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor', message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, package: pkg } = body;

    const token = process.env.SUPERFRETE_TOKEN;
    const from = process.env.ORIGIN_CEP;

    if (!token || !from) {
      return NextResponse.json(
        { error: 'Configuração do SuperFrete incompleta (Token ou CEP de origem faltando)' },
        { status: 500 }
      );
    }

    // Clean CEPs (remove non-digits)
    const cleanFrom = from.replace(/\D/g, '');
    const cleanTo = to.replace(/\D/g, '');

    if (cleanTo.length !== 8) {
      return NextResponse.json(
        { error: 'CEP de destino inválido' },
        { status: 400 }
      );
    }

    const payload = {
      from: cleanFrom,
      to: cleanTo,
      services: "PAC,SEDEX,MINI_ENVIOS",
      package: {
        weight: pkg.weight || 0.5,
        height: pkg.height || 10,
        width: pkg.width || 15,
        length: pkg.length || 20,
      },
    };

    const response = await fetch('https://api.superfrete.com/api/v0/calculator', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Superfrete ([email protected])',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('SuperFrete API Error:', data);
      return NextResponse.json(
        { error: data.message || 'Erro ao calcular frete no SuperFrete' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Shipping Calculation Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao calcular frete' },
      { status: 500 }
    );
  }
}

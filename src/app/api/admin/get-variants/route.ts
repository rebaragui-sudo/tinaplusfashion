import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const password = searchParams.get('password');

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'productId é obrigatório' }, { status: 400 });
    }

    const { rows } = await query('SELECT * FROM product_variants WHERE product_id = $1', [productId]);

    return NextResponse.json({ variants: rows });
  } catch (error: any) {
    console.error('Get variants error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
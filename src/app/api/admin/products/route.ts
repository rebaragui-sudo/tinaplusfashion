import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC');

    return NextResponse.json({ products: rows });
  } catch (error: any) {
    console.error('Products list error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
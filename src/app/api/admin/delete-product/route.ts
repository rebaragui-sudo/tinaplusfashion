import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password, id } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    // Delete variants first (cascade should handle this, but be explicit)
    await query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    // Delete product
    await query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
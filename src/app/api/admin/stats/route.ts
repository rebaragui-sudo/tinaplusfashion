import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const { rows: orders } = await query('SELECT total_amount, status FROM orders');
    const { rows: countResult } = await query('SELECT COUNT(*) as count FROM products');

    const total = orders.reduce((acc, order) => acc + (parseFloat(order.total_amount) || 0), 0);

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue: total,
      activeProducts: parseInt(countResult[0]?.count || '0'),
    });
  } catch (error: any) {
    console.error('Stats error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
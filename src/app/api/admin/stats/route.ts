import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: orders } = await supabase.from('orders').select('total_amount, status');
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    const total = orders ? orders.reduce((acc, order) => acc + (order.total_amount || 0), 0) : 0;

    return NextResponse.json({
      totalOrders: orders?.length || 0,
      totalRevenue: total,
      activeProducts: productCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
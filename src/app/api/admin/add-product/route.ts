import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password, ...productData } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price),
        image_url: productData.image_url || '',
        images: productData.images || [],
        category: productData.category || '',
        is_featured: productData.is_featured || false,
        is_new_arrival: productData.is_new_arrival || false,
        colors: productData.colors || [],
        sizes: productData.sizes || ['P', 'M', 'G', 'GG'],
      }])
      .select()
      .single();

    if (error) throw error;

    // Create variants with stock
    if (productData.colors && productData.sizes) {
      const variants = [];
      for (const color of productData.colors) {
        for (const size of productData.sizes) {
          const stock = parseInt(productData.stockMap?.[`${color}|${size}`] || '5');
          variants.push({
            product_id: data.id,
            color,
            size,
            stock,
          });
        }
      }
      if (variants.length > 0) {
        const { error: vError } = await supabase
          .from('product_variants')
          .insert(variants);
        if (vError) throw vError;
      }
    }

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
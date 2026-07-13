import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password, id, ...productData } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .update({
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
      })
      .eq('id', id);

    if (error) throw error;

    // Delete old variants
    await supabase.from('product_variants').delete().eq('product_id', id);

    // Insert current variants
    if (productData.colors && productData.sizes) {
      const variants = [];
      for (const color of productData.colors) {
        for (const size of productData.sizes) {
          const stock = parseInt(productData.stockMap?.[`${color}|${size}`] || '5');
          variants.push({
            product_id: id,
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
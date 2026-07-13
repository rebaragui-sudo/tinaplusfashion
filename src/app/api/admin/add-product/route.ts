import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { password, ...productData } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Insert product
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

    // Create variants
    if (productData.colors && productData.sizes) {
      const variants = [];
      for (const color of productData.colors) {
        for (const size of productData.sizes) {
          variants.push({
            product_id: data.id,
            color,
            size,
            stock: 5,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
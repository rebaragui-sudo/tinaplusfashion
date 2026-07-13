import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password, id, ...productData } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    await query(
      `UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, images=$5, category=$6, is_featured=$7, is_new_arrival=$8, colors=$9, sizes=$10
       WHERE id=$11`,
      [
        productData.name,
        productData.description || '',
        parseFloat(productData.price),
        productData.image_url || '',
        JSON.stringify(productData.images || []),
        productData.category || '',
        productData.is_featured || false,
        productData.is_new_arrival || false,
        JSON.stringify(productData.colors || []),
        JSON.stringify(productData.sizes || ['P', 'M', 'G', 'GG']),
        id,
      ]
    );

    // Delete old variants
    await query('DELETE FROM product_variants WHERE product_id = $1', [id]);

    // Insert current variants
    if (productData.colors && productData.sizes) {
      for (const color of productData.colors) {
        for (const size of productData.sizes) {
          const stock = parseInt(productData.stockMap?.[`${color}|${size}`] || '5');
          await query(
            `INSERT INTO product_variants (product_id, color, size, stock) VALUES ($1, $2, $3, $4)`,
            [id, color, size, stock]
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
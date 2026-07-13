import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password, ...productData } = await request.json();

    if (password !== 'tina2025') {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
    }

    // Insert product
    const { rows } = await query(
      `INSERT INTO products (name, description, price, image_url, images, category, is_featured, is_new_arrival, colors, sizes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
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
      ]
    );

    const product = rows[0];

    // Create variants with stock
    if (productData.colors && productData.sizes) {
      for (const color of productData.colors) {
        for (const size of productData.sizes) {
          const stock = parseInt(productData.stockMap?.[`${color}|${size}`] || '5');
          await query(
            `INSERT INTO product_variants (product_id, color, size, stock) VALUES ($1, $2, $3, $4)`,
            [product.id, color, size, stock]
          );
        }
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
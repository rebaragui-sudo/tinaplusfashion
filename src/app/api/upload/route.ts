import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `product-images/${fileName}`;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
    }

    const supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: `Erro no upload: ${uploadError.message}` }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl, success: true });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao fazer upload' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
    }

    const supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Cria o usuário já com e-mail confirmado (sem precisar de confirmação)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists') || error.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Não foi possível criar a conta.' }, { status: 500 });
    }

    // Salva o perfil
    await supabaseAdmin.from('profiles').upsert([{
      id: data.user.id,
      full_name: fullName,
      phone: phone || ''
    }]);

    return NextResponse.json({ success: true, userId: data.user.id });
  } catch (error: any) {
    console.error('Register route error:', error.message);
    return NextResponse.json({ error: 'Erro interno ao criar conta.' }, { status: 500 });
  }
}

'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  async function cadastrar() {
    setError('');
    if (!fullName || !email || !password) { setError('Preencha todos os campos obrigatórios.'); return; }
    if (password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }

    setLoading(true);
    try {
      // 1. Cria o usuário via API server-side (já confirma o e-mail automaticamente, sem enviar e-mail)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone })
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError('Este e-mail já está cadastrado. Tente fazer login.');
        } else {
          setError(result.error || 'Erro ao criar conta. Tente novamente.');
        }
        return;
      }

      // 2. Faz login automaticamente
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        // Conta criada mas login falhou — manda para login com mensagem
        router.push(`/login?cadastro=ok&email=${encodeURIComponent(email)}`);
        return;
      }

      // 3. Sucesso — mostra tela e redireciona
      setSuccess(true);
      setTimeout(() => {
        router.push(redirect === 'checkout' ? '/?checkout=true' : '/minha-conta');
      }, 2000);
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 text-center">
        <div className="bg-green-100 rounded-full p-4">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Cadastro concluído!</h2>
        <p className="text-gray-500 text-sm">Sua conta foi criada com sucesso.<br />Você será redirecionada em instantes...</p>
        <Loader2 className="h-5 w-5 animate-spin text-[#800020] mt-2" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4">
      <Link href="/login" className="text-sm text-gray-500 hover:underline flex items-center gap-1">← Voltar para o login</Link>
      <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
        <input className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#800020]" placeholder="Seu nome" value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">E-mail *</label>
        <input type="email" className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#800020]" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Telefone (opcional)</label>
        <input className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#800020]" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Senha *</label>
        <input type="password" className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#800020]" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <button
        onClick={cadastrar}
        disabled={loading}
        className="mt-2 bg-[#121812] hover:bg-[#121812]/90 disabled:opacity-60 text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Criando conta...</> : 'Cadastrar'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-[#b8860b] font-medium hover:underline">Entrar</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfaf8]">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

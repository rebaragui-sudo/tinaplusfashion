'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Lock, Mail, Loader2, ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        try {
          await fetch('/api/auth/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id }),
          });
        } catch (_) {}

        try {
          await supabase.from('profiles').insert([{
            id: data.user.id,
            full_name: fullName,
            phone: phone
          }]);
        } catch (_) {}

        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

        setSuccess(true);

        await new Promise(res => setTimeout(res, 2000));

        if (loginError) {
          router.push('/login');
          return;
        }

        if (redirect === 'checkout') {
          router.push('/?checkout=true');
        } else {
          router.push('/minha-conta');
        }
      }
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#121812]">Cadastro concluído!</h2>
            <p className="text-muted-foreground text-center text-sm">
              Sua conta foi criada com sucesso.<br />Redirecionando...
            </p>
            <Loader2 className="h-5 w-5 animate-spin text-[#800020]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <Link href="/login" className="inline-flex items-center text-sm text-[#121812] hover:underline mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o login
      </Link>
      <Card className="border-none shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#121812]">Criar Conta</CardTitle>
          <CardDescription>Preencha os dados abaixo para se cadastrar</CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="fullName" placeholder="Seu nome" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="phone" placeholder="(00) 00000-0000" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="button" onClick={handleRegister} className="w-full bg-[#121812] hover:bg-[#121812]/90 text-white" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando conta...</>) : 'Cadastrar'}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#b8860b] font-medium hover:underline">Entrar</Link>
            </div>
          </CardFooter>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfaf8]">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-[#121812]" />}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

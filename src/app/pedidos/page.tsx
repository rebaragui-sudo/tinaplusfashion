'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function PedidosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('order_nsu');
  const isMock = searchParams.get('mock') === 'true';
  const isSuccess = searchParams.get('paid') === 'true' || searchParams.get('receipt_url') !== null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no orderId is present, redirect to account
    if (!orderId && !isSuccess) {
      const timer = setTimeout(() => {
        router.replace('/minha-conta');
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [orderId, isSuccess, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#800020] mb-4" />
        <p className="text-muted-foreground">Carregando informações do pedido...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {isMock ? 'Simulação de Pagamento' : 'Pedido Confirmado!'}
          </h1>
          <p className="text-muted-foreground">
            {isMock 
              ? 'Esta é uma tela de demonstração. O sistema de pagamento está funcionando em modo de teste.'
              : 'Seu pagamento foi processado com sucesso e seu pedido já está em nosso sistema.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detalhes do Pedido</p>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">ID do Pedido:</span>
            <span className="text-sm font-mono font-bold text-gray-900">{orderId?.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-bold text-green-600">Aguardando Envio</span>
          </div>
        </div>

        {searchParams.get('receipt_url') && (
          <Button asChild variant="outline" className="w-full flex items-center gap-2">
            <a href={searchParams.get('receipt_url')!} target="_blank" rel="noopener noreferrer">
              Ver Comprovante <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}

        <div className="grid grid-cols-1 gap-3 pt-4">
          <Button asChild className="bg-[#121812] hover:bg-[#800020] text-white py-6">
            <Link href="/minha-conta" className="flex items-center justify-center gap-2">
              Ver Meus Pedidos <Package className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-gray-500 hover:text-[#800020]">
            <Link href="/" className="flex items-center justify-center gap-2">
              Voltar para a Loja <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {isMock && (
        <p className="mt-8 text-xs text-gray-400 max-w-xs text-center">
          Dica: Para ativar o pagamento real, configure o seu InfiniteTag no painel administrativo.
        </p>
      )}
    </div>
  );
}

export default function PedidosPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#800020] mb-4" />
      </div>
    }>
      <PedidosContent />
    </Suspense>
  );
}

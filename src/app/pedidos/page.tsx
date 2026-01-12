'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PedidosRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/minha-conta');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Redirecionando...</p>
    </div>
  );
}

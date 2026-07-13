'use client';

import { useEffect, useState } from 'react';

export default function AddDuplaFace() {
  const [status, setStatus] = useState('Preparando...');

  useEffect(() => {
    async function add() {
      setStatus('Cadastrando produto...');
      try {
        const res = await fetch('/api/admin/add-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: 'tina2025',
            name: 'DUPLA FACE ANIMAL PRINT',
            description: 'Dupla face um lado animal print outro lado liso',
            price: '95.00',
            image_url: '/dupla-face-animal-print.jpeg',
            images: [],
            category: 'Blusas',
            is_featured: false,
            is_new_arrival: true,
            colors: ['Animal Print:estampa:/dupla-face-animal-print.jpeg'],
            sizes: ['P', 'M', 'G', 'GG'],
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus('Erro: ' + (data.error || 'Falha ao cadastrar'));
          return;
        }

        setStatus('Produto cadastrado com sucesso!');
      } catch (err: any) {
        setStatus('Erro: ' + err.message);
      }
    }
    add();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">{status}</h1>
        {status === 'Produto cadastrado com sucesso!' && (
          <div>
            <p className="text-green-600 mb-4">O produto foi adicionado ao banco de dados!</p>
            <a
              href="/admin"
              className="px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#600018] inline-block"
            >
              Voltar ao Admin
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
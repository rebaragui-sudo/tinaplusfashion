'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function AddDuplaFace() {
  const [status, setStatus] = useState('Preparando...');

  useEffect(() => {
    async function add() {
      setStatus('Cadastrando produto...');
      try {
        const supabase = createClient(
          'https://tbicapdftjjcdxjnhbfi.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaWNhcGRmdGpqY2R4am5iaGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTYzNjgsImV4cCI6MjA5OTE5MjM2OH0.tJamv6Gb2L2kSfR73gr714Q-15TXnfhbQg9LzizIEGw'
        );

        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: 'DUPLA FACE ANIMAL PRINT',
            description: 'Dupla face um lado animal print outro lado liso',
            price: 95.00,
            image_url: '/dupla-face-animal-print.jpeg',
            images: [],
            category: 'Blusas',
            is_featured: false,
            is_new_arrival: true,
            colors: ['Animal Print:estampa:/dupla-face-animal-print.jpeg'],
            sizes: ['P', 'M', 'G', 'GG'],
          }])
          .select()
          .single();

        if (error) {
          setStatus('Erro: ' + error.message);
          return;
        }

        // Create variants
        const variants = [];
        for (const color of data.colors) {
          for (const size of data.sizes) {
            variants.push({
              product_id: data.id,
              color,
              size,
              stock: 5,
            });
          }
        }

        const { error: vError } = await supabase
          .from('product_variants')
          .insert(variants);

        if (vError) {
          setStatus('Variants error: ' + vError.message);
        } else {
          setStatus('Produto cadastrado com sucesso!');
        }
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
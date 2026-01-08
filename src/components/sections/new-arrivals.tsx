'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, ShoppingBag, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  is_new_arrival: boolean;
  sizes: string[];
}

const ProductCard = ({ product }: { product: Product }) => (
  <a className="group block h-full flex flex-col" href={`/produto/${product.id}`}>
    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3f1] rounded-lg">
      <img 
        src={product.image_url} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {product.is_new_arrival && (
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Novidade
          </span>
        )}
      </div>

      <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#71717a] hover:bg-white hover:text-[#800020] transition-all shadow-sm">
        <Heart size={20} />
      </button>

      {/* Hover Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block">
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-black text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#800020] hover:text-white transition-colors">
            <ShoppingBag size={18} />
            Adicionar
          </button>
          <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-all">
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>

    <div className="py-4 flex flex-col flex-grow">
      <p className="text-[11px] text-[#71717a] uppercase tracking-widest mb-1 font-semibold">{product.category}</p>
      <h3 className="text-sm font-medium text-black line-clamp-2 mb-2 group-hover:text-[#800020] transition-colors">
        {product.name}
      </h3>
      
      <div className="flex items-baseline gap-2 flex-wrap mb-1">
        <span className="text-lg font-bold text-black">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </span>
      </div>
      
      <p className="text-[11px] text-[#71717a]">ou 10x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 10)} sem juros</p>

      <div className="flex flex-wrap gap-1 mt-3">
        {['44', '46', '48', '50', '52'].map((size, idx) => (
          <span key={idx} className="text-[10px] px-2 py-1 bg-[#f5f3f1] rounded text-[#71717a] font-medium min-w-[24px] text-center">
            {size}
          </span>
        ))}
      </div>
    </div>
  </a>
);

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new_arrival', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Loader2 className="animate-spin text-[#800020]" size={32} />
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-black mb-1">
              Novidades da Estação
            </h2>
            <p className="text-[#71717a] text-sm md:text-base">
              Peças exclusivas que acabaram de chegar
            </p>
          </div>
          <a 
            href="/novidades" 
            className="text-[#800020] text-sm font-bold flex items-center gap-1 hover:underline transition-all"
          >
            Ver todos <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

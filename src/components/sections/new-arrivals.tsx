'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, ShoppingBag, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { getColorValue, getColorName, getEstampaImage } from '@/lib/colors';
import { getProductCombo } from '@/lib/combos';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  is_new_arrival: boolean;
  colors: string[];
  sizes: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/produto/${product.id}`);
  };

  return (
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
          {(() => { const combo = getProductCombo(product.id); return combo ? (
            <span className="bg-[#800020] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {combo.quantity} por R${combo.price}
            </span>
          ) : null; })()}
        </div>

        <button 
          className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#71717a] hover:bg-white hover:text-[#800020] transition-all shadow-sm z-10"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <Heart size={20} />
        </button>

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block">
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#800020] hover:text-white transition-colors"
            >
              <ShoppingBag size={18} />
              Adicionar
            </button>
            <button 
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-all"
              onClick={handleView}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Mobile quick add button */}
        <div className="absolute bottom-2 right-2 md:hidden">
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-[#121812] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className="py-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-semibold">{product.category}</p>
          
          {/* Color dots */}
          <div className="flex gap-1">
            {(product.colors || []).slice(0, 3).map((color, idx) => (
              getColorValue(color) === 'estampa' ? (
                getEstampaImage(color) ? (
                  <img key={idx} src={getEstampaImage(color)!} className="w-2.5 h-2.5 rounded-full border border-gray-200 object-cover" title={getColorName(color)} />
                ) : (
                  <div key={idx} className="w-2.5 h-2.5 rounded-full border border-gray-200 bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300" title={getColorName(color)} />
                )
              ) : (
                <div
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: getColorValue(color) }}
                />
              )
            ))}
            {(product.colors?.length || 0) > 3 && (
              <span className="text-[8px] text-muted-foreground">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        <h3 className="text-sm font-medium text-black line-clamp-2 mb-2 group-hover:text-[#800020] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-lg font-bold text-black">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>
        
        <p className="text-[11px] text-[#71717a]">ou até 12x no cartão</p>

        <div className="flex flex-wrap gap-1 mt-3">
          {(product.sizes || []).map((size, idx) => (
            <span key={idx} className="text-[10px] px-2 py-1 bg-[#f5f3f1] rounded text-[#71717a] font-medium min-w-[24px] text-center">
              {size}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

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

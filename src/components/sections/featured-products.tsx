'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Eye, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  colors: string[];
  sizes: string[];
}

export default function FeaturedProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(4);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Loader2 className="animate-spin text-[#800020]" size={32} />
      </div>
    );
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Achados com Preço Especial
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ofertas imperdíveis selecionadas para você
            </p>
          </div>
          <a 
            href="/promocao" 
            className="text-primary font-medium flex items-center text-sm hover:underline transition-all"
          >
            Ver todos <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.is_new_arrival && (
                    <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm">
                      Novidade
                    </span>
                  )}
                  <span className="bg-[#800020] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm">
                    Oferta
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-[#800020] hover:bg-white transition-all shadow-sm">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Hover Add to Cart Action */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold h-10 rounded-md hover:bg-[#800020] hover:text-white transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Adicionar
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-md hover:bg-white transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {product.category}
                  </span>
                  
                  {/* Color dots */}
                  <div className="flex gap-1">
                    {(product.colors || []).slice(0, 3).map((color, idx) => (
                      <div 
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {(product.colors?.length || 0) > 3 && (
                      <span className="text-[8px] text-muted-foreground">+{product.colors.length - 3}</span>
                    )}
                  </div>
                </div>

                <a href={`/produto/${product.id}`} className="group-hover:text-[#800020] transition-colors">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 leading-tight h-10">
                    {product.name}
                  </h3>
                </a>
                
                <div className="flex items-baseline gap-2 flex-wrap mt-auto">
                  <span className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </span>
                </div>
                
                <p className="text-[11px] text-muted-foreground mt-1">
                  ou 10x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 10)} sem juros
                </p>

                  {/* Size Chips */}
                  <div className="hidden md:flex gap-1 mt-4 flex-wrap">
                    {(product.sizes || []).map((size, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] px-2 py-1 bg-secondary rounded text-muted-foreground font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

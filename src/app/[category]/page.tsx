
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Loader2, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  is_new_arrival: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        // Match category (case insensitive or exact match depending on DB)
        // Usually slugs are lowercase
        if (categorySlug !== 'produtos') {
          query = query.ilike('category', `%${categorySlug}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug]);

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <nav className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                <a href="/" className="hover:text-primary">Início</a>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{categoryName}</span>
              </nav>
              <h1 className="text-3xl font-bold font-display text-foreground">
                {categorySlug === 'produtos' ? 'Todos os Produtos' : categoryName}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-secondary transition-colors md:self-end">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar & Ordenar
            </button>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center items-center">
              <Loader2 className="animate-spin text-[#800020]" size={40} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <h3 className="text-xl font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">Tente buscar por outra categoria ou volte mais tarde.</p>
              <a 
                href="/produtos" 
                className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-[#800020] transition-colors"
              >
                Ver todos os produtos
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

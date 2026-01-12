
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { Loader2, Check, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
}

function ComboSelectionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addCombo } = useCart();
  
  const categorySlug = params.category as string;
  const quantityRequired = parseInt(searchParams.get('q') || '3');
  const totalPrice = parseFloat(searchParams.get('p') || '100');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        // Match category (handling common variations)
        let categoryFilter = categorySlug;
        if (categorySlug === 'calcas') categoryFilter = 'calça';
        
        query = query.ilike('category', `%${categoryFilter}%`);

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

  const toggleProduct = (product: Product) => {
    setSelectedItems(prev => {
      const index = prev.findIndex(item => item.id === product.id);
      if (index > -1) {
        // Remove item (actually remove the first occurrence of this product)
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
      } else {
        // Add item
        if (prev.length < quantityRequired) {
          return [...prev, product];
        } else {
          toast.error(`Você já selecionou o limite de ${quantityRequired} itens.`);
          return prev;
        }
      }
    });
  };

  const handleAddCombo = () => {
    if (selectedItems.length !== quantityRequired) {
      toast.error(`Por favor, selecione ${quantityRequired} itens para o combo.`);
      return;
    }

    addCombo({
      name: `Combo ${quantityRequired} ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`,
      price: totalPrice,
      subItems: selectedItems
    });

    router.push('/');
  };

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <main className="flex-grow pt-8 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Monte seu Combo: {quantityRequired} por {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione {quantityRequired} produtos da lista abaixo para aproveitar a oferta.
          </p>
        </div>

        {/* Status Bar */}
        <div className="sticky top-20 z-30 bg-white border-b py-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(quantityRequired)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    i < selectedItems.length 
                      ? 'bg-[#800020] border-[#800020] text-white' 
                      : 'bg-white border-muted text-muted-foreground'
                  }`}
                >
                  {i < selectedItems.length ? <Check size={16} /> : i + 1}
                </div>
              ))}
            </div>
            <span className="font-medium text-sm hidden md:inline">
              {selectedItems.length} de {quantityRequired} selecionados
            </span>
          </div>

          <Button 
            onClick={handleAddCombo}
            disabled={selectedItems.length !== quantityRequired}
            className="bg-[#800020] hover:bg-[#600018] text-white"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Adicionar Combo ao Carrinho
          </Button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <Loader2 className="animate-spin text-[#800020]" size={40} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const selectionCount = selectedItems.filter(item => item.id === product.id).length;
              const isSelected = selectionCount > 0;
              
              return (
                <div 
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected ? 'border-[#800020]' : 'border-transparent hover:border-muted'
                  }`}
                >
                  <div className="aspect-[3/4] bg-secondary">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {selectionCount > 0 && (
                      <div className="absolute top-2 right-2 bg-[#800020] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                        {selectionCount}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="text-xs font-medium text-foreground line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-xl font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">Tente buscar por outra categoria ou volte mais tarde.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ComboSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-[#800020]" size={40} /></div>}>
        <ComboSelectionContent />
      </Suspense>
      <Footer />
    </div>
  );
}

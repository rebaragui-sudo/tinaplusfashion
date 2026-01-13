'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, category')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div 
        className="absolute inset-0 bg-[#121812]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b flex items-center gap-4">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="O que você está procurando?"
            className="flex-grow bg-transparent border-none outline-none text-lg text-[#121812]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
              <p className="text-sm text-gray-500">Buscando as melhores peças...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                Produtos Encontrados
              </p>
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="h-16 w-12 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-[#121812] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-[#800020] font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">Nenhum produto encontrado para "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Tente usar termos mais genéricos</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-500">Busque por vestidos, conjuntos, chemises...</p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="p-4 bg-gray-50 border-t text-center">
            <Link 
              href={`/produtos?q=${query}`}
              onClick={onClose}
              className="text-sm font-bold text-[#D4AF37] hover:underline"
            >
              Ver todos os resultados
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;

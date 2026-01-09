
'use client';

import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  is_new_arrival: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Logic for viewing product could go here if different from main link
    window.location.href = `/produto/${product.id}`;
  };

  return (
    <a href={`/produto/${product.id}`} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
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
          {product.is_featured && (
            <span className="bg-[#800020] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm">
              Oferta
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-[#800020] hover:bg-white transition-all shadow-sm z-10"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Hover Add to Cart Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold h-10 rounded-md hover:bg-[#800020] hover:text-white transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Adicionar
          </button>
          <button 
            onClick={handleView}
            className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-md hover:bg-white transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 leading-tight h-10 group-hover:text-[#800020] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          <span className="text-lg font-bold text-foreground">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>
        
        <p className="text-[11px] text-muted-foreground mt-1">
          ou 10x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 10)} sem juros
        </p>
      </div>
    </a>
  );
}

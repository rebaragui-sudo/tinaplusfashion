'use client';

import React from 'react';
import { Search, Heart, ShoppingBag, User, Maximize, Menu } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import CartDrawer from '@/components/cart-drawer';

const Header = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e4e4e7]">
      <CartDrawer />
      {/* Brand top-bar strip */}
      <div className="h-1 bg-[#D4AF37] w-full" />

      {/* Primary-colored announcement bar */}
      <div className="bg-[#121812] text-white text-center py-2 px-4 text-sm font-sans">
        <span className="hidden md:inline">
            Compra mínima de R$ 350,00 | Troca fácil até 7 dias | Até 12x sem juros
          </span>
          <span className="md:hidden">Compra mínima de R$ 350,00</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button className="inline-flex items-center justify-center rounded-md h-10 w-10 md:hidden hover:bg-[#f5f3f1] transition-colors">
            <Menu className="h-6 w-6 text-[#121812]" />
          </button>

          {/* Logo Section */}
          <a className="flex items-center gap-3 group md:-ml-8" href="/">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=8000&height=8000&resize=contain" 
              alt="Tina Plus Logo" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-[#D4AF37]"
            />
            <h1 className="font-serif text-2xl md:text-[32px] font-bold text-[#121812] flex">
              Tina<span className="text-[#D4AF37]"> Plus</span>
            </h1>
          </a>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 ml-40">
            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#D4AF37]" 
              href="/"
            >
              Início
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all w-0 group-hover:w-full"></span>
            </a>
            
            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#D4AF37]" 
              href="/produtos"
            >
              Produtos
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all w-0 group-hover:w-full"></span>
            </a>

            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#D4AF37]" 
              href="/vestidos"
            >
              Vestidos
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all w-0 group-hover:w-full"></span>
            </a>

            <a 
              className="text-sm font-medium transition-colors relative group text-[#800020]" 
              href="/promocao"
            >
              Promoção
              <span className="absolute -top-3 -right-3 text-[10px] bg-[#800020] text-white px-1.5 py-0.5 rounded-full font-bold">
                60%
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#800020] transition-all w-0 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Functional Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]">
              <Search className="h-5 w-5" />
            </button>
            
            <button className="hidden md:inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]">
              <Maximize className="h-5 w-5" />
            </button>

            <a href="/favoritos" className="hidden md:block">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]">
                <Heart className="h-5 w-5" />
              </button>
            </a>

            <button 
              onClick={() => setIsOpen(true)}
              className="relative inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#800020] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            <a href="/login">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]">
                <User className="h-5 w-5" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

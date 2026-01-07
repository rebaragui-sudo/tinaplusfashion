import React from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

/**
 * Header component for Sheila Modas Plus Size.
 * Includes the top utility bar and main navigation.
 */
const Header = () => {
  return (
    <header className="w-full bg-[#3d0021] text-white z-50 relative">
      {/* Top Utility Information Bar */}
      <div className="hidden lg:block border-b border-[#9c848d]/30">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-[10px] uppercase tracking-widest font-condensed text-[#9c848d]">
          <div className="flex gap-6">
            <span>(11) 93730-8369</span>
            <span>contato.sheilamodasplussize@gmail.com</span>
          </div>
          <div className="flex gap-4">
            <a href="/account/register" className="hover:text-white transition-colors">Cadastre-se</a>
            <span className="text-[#9c848d]/50">|</span>
            <a href="/account/login" className="hover:text-white transition-colors">Login</a>
          </div>
        </div>
      </div>

      {/* Mobile Header (Visible on small screens) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#3d0021]">
        <button className="text-white" aria-label="Menu">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-sm font-display font-bold uppercase tracking-widest">Início</div>
        <button className="text-white" aria-label="Pesquisar">
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Main Navigation Row */}
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
        {/* Logo */}
        <div className="flex-shrink-0 w-[120px] md:w-[150px] lg:w-[180px]">
            <a href="/" className="block">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767801263809.jpg?width=8000&height=8000&resize=contain"
                alt="Tina Plus"
                width={180}
                height={80}
                priority
                className="w-full h-auto object-contain"
              />
            </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-display font-bold uppercase tracking-[0.15em]">
          <a href="/" className="text-white border-b border-transparent hover:border-[#9c848d]">Início</a>
          <a href="/produtos" className="text-white border-b border-transparent hover:border-[#9c848d]">Produtos</a>
          <a href="/contato" className="text-white border-b border-transparent hover:border-[#9c848d]">Contato</a>
          <a href="/quem-somos" className="text-white border-b border-transparent hover:border-[#9c848d]">Quem Somos</a>
        </nav>

        {/* Search and Action Icons */}
        <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto justify-center lg:justify-end">
          {/* Search Bar Desktop */}
          <div className="hidden md:flex relative group">
            <input 
              type="text" 
              placeholder="BUSCAR" 
              className="bg-transparent border border-[#9c848d]/50 px-4 py-2 pr-10 text-[11px] uppercase tracking-widest w-[160px] lg:w-[220px] focus:outline-none focus:ring-0 focus:border-[#9c848d] transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c848d] group-hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Account and Cart */}
          <div className="flex items-center gap-5">
            <a href="/account/login" className="hidden lg:flex items-center text-[#9c848d] hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </a>
            
            <a href="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-[#9c848d] group-hover:text-white transition-colors" />
                <span className="absolute -top-2 -right-2 bg-[#9c848d] text-[#3d0021] text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </div>
              <div className="hidden md:flex flex-col leading-none">
                <span className="text-[10px] text-[#9c848d] font-condensed uppercase tracking-tighter">Carrinho</span>
                <span className="text-[12px] text-white font-condensed font-bold">R$0,00</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Shopping/Products Tab Bar (Floating feel but docked) */}
      <div className="lg:hidden grid grid-cols-3 border-t border-[#9c848d]/20 bg-[#541d3b]">
        <a href="/" className="flex flex-col items-center py-2 gap-1 border-r border-[#9c848d]/10 selected">
          <Menu className="w-5 h-5 text-white" />
          <span className="text-[10px] uppercase font-display font-bold">Início</span>
        </a>
        <button className="flex flex-col items-center py-2 gap-1 border-r border-[#9c848d]/10">
          <div className="w-5 h-5 border-2 border-white rounded-[1px] flex items-center justify-center">
            <div className="w-3 h-[1px] bg-white"></div>
          </div>
          <span className="text-[10px] uppercase font-display font-bold">Produtos</span>
        </button>
        <a href="/cart" className="flex flex-col items-center py-2 gap-1 relative">
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1/3 bg-[#9c848d] text-[#3d0021] text-[8px] font-bold px-1 min-w-[14px] text-center">0</span>
          <span className="text-[10px] uppercase font-display font-bold">Carrinho</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
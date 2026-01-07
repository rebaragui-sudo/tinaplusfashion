import React from 'react';
import Image from 'next/image';
import { Menu, Search, Maximize, Heart, ShoppingBag, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Red accent line at the very top */}
      <div className="h-1 bg-[#dc2626] w-full" />

      {/* Announcement Bar */}
      <div className="bg-[#121212] text-white text-center py-2 px-4 text-[14px] leading-[20px] font-medium font-sans">
        <div className="container mx-auto">
          <span className="hidden md:inline">
            Frete grátis acima de R$ 299 | Troca fácil em até 30 dias | Até 10x sem juros
          </span>
          <span className="inline md:hidden">
            Frete grátis acima de R$ 299
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile Menu Button */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden">
            <Menu className="h-6 w-6 text-[#121212]" />
          </button>

          {/* Logo */}
          <a className="flex items-center gap-2" href="/">
            <div className="relative h-10 md:h-12 w-10 md:w-12">
               <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/icons/logo-hrqhCEHN-1.png"
                alt="HubPMG"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-serif text-[24px] md:text-[30px] font-bold text-[#121212]">
              Hub<span className="text-[#e21d48]">PMG</span>
            </h1>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              className="text-[14px] font-medium transition-colors relative group text-[#121212] hover:text-[#e21d48] font-sans" 
              href="/blazers"
            >
              Blazers
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>
            
            <a 
              className="text-[14px] font-medium transition-colors relative group text-[#e21d48] font-sans" 
              href="/promocao"
            >
              Promoção
              <span className="absolute -top-3 -right-3 text-[10px] bg-[#e21d48] text-white px-1.5 py-0.5 rounded-full font-bold">
                60%
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>
            
            <a 
              className="text-[14px] font-medium transition-colors relative group text-[#121212] hover:text-[#e21d48] font-sans" 
              href="/bermudas"
            >
              Bermudas
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>
            
            <a 
              className="text-[14px] font-medium transition-colors relative group text-[#121212] hover:text-[#e21d48] font-sans" 
              href="/regatas"
            >
              Regatas
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Functional Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon */}
            <button className="inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors hover:bg-[#fceef1] group">
              <Search className="h-5 w-5 text-[#121212] group-hover:text-[#e21d48]" />
            </button>

            {/* Maximize Icon (Hidden on mobile) */}
            <button className="hidden md:inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors hover:bg-[#fceef1] group">
              <Maximize className="h-5 w-5 text-[#121212] group-hover:text-[#e21d48]" />
            </button>

            {/* Favorites Icon */}
            <a href="/favoritos" className="hidden md:block">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors hover:bg-[#fceef1] group">
                <Heart className="h-5 w-5 text-[#121212] group-hover:text-[#e21d48]" />
              </button>
            </a>

            {/* Shopping Cart Icon */}
            <a href="/carrinho" className="relative">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors hover:bg-[#fceef1] group">
                <ShoppingBag className="h-5 w-5 text-[#121212] group-hover:text-[#e21d48]" />
              </button>
            </a>

            {/* User Account Icon */}
            <a href="/login">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors hover:bg-[#fceef1] group">
                <User className="h-5 w-5 text-[#121212] group-hover:text-[#e21d48]" />
              </button>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Search, Heart, ShoppingBag, User, Maximize, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e4e4e7]">
      {/* Red top-bar strip */}
      <div className="h-1 bg-[#dc2626] w-full" />

      {/* Primary-colored announcement bar */}
      <div className="bg-[#121812] text-white text-center py-2 px-4 text-sm font-sans">
        <span className="hidden md:inline">
          Frete grátis acima de R$ 299 | Troca fácil em até 30 dias | Até 10x sem juros
        </span>
        <span className="md:hidden">Frete grátis acima de R$ 299</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button className="inline-flex items-center justify-center rounded-md h-10 w-10 md:hidden hover:bg-[#f5f3f1] transition-colors">
            <Menu className="h-6 w-6 text-[#121812]" />
          </button>

          {/* Logo Section */}
          <a className="flex items-center gap-2 group" href="/">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/icons/logo-hrqhCEHN-1.png" 
              alt="HubPMG" 
              className="h-10 md:h-12 w-auto"
            />
            <h1 className="font-serif text-2xl md:text-[30px] font-bold text-[#121812] flex">
              Hub<span className="text-[#e21d48]">PMG</span>
            </h1>
          </a>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#e21d48]" 
              href="/blazers"
            >
              Blazers
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>
            
            <a 
              className="text-sm font-medium transition-colors relative group text-[#e21d48]" 
              href="/promocao"
            >
              Promoção
              <span className="absolute -top-3 -right-3 text-[10px] bg-[#e21d48] text-white px-1.5 py-0.5 rounded-full font-bold">
                60%
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>

            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#e21d48]" 
              href="/bermudas"
            >
              Bermudas
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
            </a>

            <a 
              className="text-sm font-medium transition-colors relative group text-[#121812] hover:text-[#e21d48]" 
              href="/regatas"
            >
              Regatas
              <span className="absolute -bottom-1 left-0 h-0.5 bg-[#e21d48] transition-all w-0 group-hover:w-full"></span>
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

            <a href="/carrinho" className="relative">
              <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-[#f5f3f1] transition-colors text-[#121812]">
                <ShoppingBag className="h-5 w-5" />
                {/* Visual badge could be added here if state management was available */}
              </button>
            </a>

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
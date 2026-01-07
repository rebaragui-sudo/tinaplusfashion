"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, Phone, Mail } from 'lucide-react';

/**
 * Header component for Tina Plus.
 * Redesigned for a cleaner, professional layout with a focus on brand identity.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Quem Somos', href: '/quem-somos' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <header className="w-full bg-background z-50 relative border-b border-border shadow-sm">
      {/* Top Utility Bar - Professional contact info */}
      <div className="bg-secondary/30 border-b border-border/50 hidden md:block">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-primary" />
              (11) 93730-8369
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-primary" />
              contato.tinaplus@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/account/login" className="hover:text-primary transition-colors">Minha Conta</a>
            <a href="/account/register" className="hover:text-primary transition-colors">Cadastrar</a>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-foreground p-2 hover:bg-secondary rounded-full transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Centered on mobile, Left on desktop */}
          <div className="flex-shrink-0 w-[100px] md:w-[140px] lg:w-[160px] absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <a href="/" className="block">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767801263809.jpg?width=800&height=800&resize=contain"
                alt="Tina Plus"
                width={160}
                height={60}
                priority
                className="w-full h-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-[0.1em]">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-foreground/80 hover:text-primary transition-all relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Icons & Search */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Icon only on mobile/tablet, subtle bar on desktop */}
            <div className="relative hidden xl:block mr-2">
              <input 
                type="text" 
                placeholder="O que você procura?" 
                className="bg-secondary/50 border-none rounded-full px-5 py-2 text-[12px] w-[200px] focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <button className="xl:hidden p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <Search className="w-5 h-5" />
            </button>

            <a href="/account/login" className="hidden md:flex p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <User className="w-5 h-5" />
            </a>
            
            <a href="/cart" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-full transition-colors group">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-background">
                  0
                </span>
              </div>
              <div className="hidden lg:flex flex-col leading-none">
                <span className="text-[12px] text-foreground font-bold tracking-tight">R$ 0,00</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-xl animate-in slide-in-from-top duration-300 z-40">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-foreground py-2 border-b border-border/50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos..." 
                  className="w-full bg-secondary/50 border-none rounded-lg px-4 py-3 text-sm"
                />
                <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <a href="/cart" className="flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 rounded-lg font-bold">
                <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Carrinho</span>
                <span>R$ 0,00</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

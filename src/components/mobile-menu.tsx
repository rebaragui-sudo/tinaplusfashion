'use client';

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from '@/components/ui/sheet';
import { ShoppingBag, Heart, User, Search, Home, Package, Percent, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const MobileMenu = ({ isOpen, onClose, onOpenSearch }: MobileMenuProps) => {
  const { totalItems, setIsOpen: setOpenCart } = useCart();
  const { user, signOut } = useAuth();

  const menuItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Produtos', href: '/produtos', icon: Package },
    { label: 'Minha Conta', href: '/minha-conta', icon: User },
    { label: 'Promoções', href: '/promocao', icon: Percent, highlight: true },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0 border-r-0">
        <SheetHeader className="p-6 border-b bg-[#121812]">
          <SheetTitle className="text-left flex items-center gap-3">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=8000&height=8000&resize=contain" 
              alt="Logo" 
              className="h-10 w-10 rounded-full border-2 border-[#D4AF37]"
            />
            <div className="flex flex-col">
              <span className="text-white font-serif text-lg leading-tight">Tina Plus Fashion</span>
              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Atacado Premium</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4 space-y-6">
            {/* User Section */}
            <div className="bg-[#f5f3f1] p-4 rounded-xl">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold text-[#121812] truncate">Olá, {user.email?.split('@')[0]}</span>
                      <Link href="/minha-conta" className="text-[10px] text-[#800020] font-bold uppercase hover:underline" onClick={onClose}>
                        Ver meu perfil
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-[#71717a]">Faça login para acompanhar seus pedidos</p>
                  <Button 
                    asChild 
                    className="w-full bg-[#121812] hover:bg-[#800020] h-9 text-xs"
                    onClick={onClose}
                  >
                    <Link href="/login">Entrar na Conta</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto flex-col py-3 gap-2 border-gray-100"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
              >
                <Search className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase">Buscar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col py-3 gap-2 border-gray-100 relative"
                onClick={() => {
                  onClose();
                  setOpenCart(true);
                }}
              >
                <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase">Carrinho</span>
                {totalItems > 0 && (
                  <span className="absolute top-2 right-4 bg-[#800020] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest px-2 mb-2">Navegação</p>
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                    item.highlight ? 'bg-[#800020]/5 text-[#800020]' : 'hover:bg-gray-50 text-[#121812]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${item.highlight ? 'text-[#800020]' : 'text-[#71717a] group-hover:text-[#D4AF37]'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
            </div>

            <Separator />

            {/* Help & Logout */}
            <div className="space-y-1">
              <Link 
                href="/sobre-nos" 
                onClick={onClose}
                className="flex items-center gap-3 p-3 text-sm text-[#71717a] hover:text-[#121812]"
              >
                <span>Sobre a Loja</span>
              </Link>
              <Link 
                href="/entregas" 
                onClick={onClose}
                className="flex items-center gap-3 p-3 text-sm text-[#71717a] hover:text-[#121812]"
              >
                <span>Políticas de Entrega</span>
              </Link>
              
              {user && (
                <button 
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sair da Conta</span>
                </button>
              )}
            </div>

            {/* Social footer */}
            <div className="pt-8 text-center pb-8">
              <p className="text-[10px] text-[#71717a]">© 2024 Tina Plus Fashion</p>
              <p className="text-[10px] text-[#71717a]">Sinta-se linda em qualquer tamanho.</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

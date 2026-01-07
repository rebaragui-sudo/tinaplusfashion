"use client";

import React from 'react';
import { Mail, Instagram, Facebook, MessageCircle, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f3f1] pt-16 pb-8 border-t border-[#e4e4e7]">
      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
            {/* Brand Column */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=8000&height=8000&resize=contain" 
                  alt="Tina Plus Logo" 
                  className="h-12 w-12 rounded-full object-cover border border-[#D4AF37]"
                />
                <h2 className="font-serif text-3xl font-bold text-[#000000]">
                  Tina<span className="text-[#D4AF37]"> Plus</span>
                </h2>
              </div>
            <p className="text-sm leading-relaxed text-[#71717a] mb-6">
              Moda plus size com elegância, conforto e caimento perfeito para todas as mulheres.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white rounded-full text-[#000000] hover:text-[#D4AF37] transition-colors shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full text-[#000000] hover:text-[#D4AF37] transition-colors shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full text-[#000000] hover:text-[#D4AF37] transition-colors shadow-sm">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Institutional Column */}
          <div className="lg:col-span-2">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
              Institucional
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Entregas</a></li>
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Privacidade</a></li>
            </ul>
          </div>

          {/* Quick Access Column */}
          <div className="lg:col-span-2">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
              Acesso Rápido
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Minha Conta</a></li>
              <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Administrador do Site</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
              Atendimento
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span className="text-sm text-[#71717a]">(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span className="text-sm text-[#71717a]">contato@tinaplus.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <div className="text-sm text-[#71717a]">
                  <p>Seg a Sex: 9h às 18h</p>
                  <p>Sáb: 9h às 13h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
              Novidades
            </h3>
            <p className="text-sm text-[#71717a] mb-6 leading-relaxed">
              Receba ofertas exclusivas e lançamentos.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="flex-1 bg-white border border-[#e4e4e7] px-4 py-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-[#800020] text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-[#600018] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e4e4e7] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-[#71717a]">
            © 2024 Tina Plus. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://img.icons8.com/color/36/000000/visa.png" alt="Visa" className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all h-6" />
            <img src="https://img.icons8.com/color/36/000000/mastercard.png" alt="Mastercard" className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all h-6" />
            <img src="https://img.icons8.com/color/36/000000/amex.png" alt="Amex" className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all h-6" />
            <img src="https://img.icons8.com/color/36/000000/pix.png" alt="Pix" className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
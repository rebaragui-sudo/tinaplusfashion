"use client";

import React from 'react';
import { Mail, Instagram, MessageCircle, Clock, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f3f1] pt-16 pb-8 border-t border-[#e4e4e7]">
      <div className="container mx-auto px-4 max-w-[1280px]">
            {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
              {/* Brand Column */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 mb-6">
                  <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=8000&height=8000&resize=contain"
                alt="Tina Plus Logo"
                className="h-12 w-12 rounded-full object-cover border border-[#D4AF37]" />

                  <h2 className="font-serif text-3xl font-bold text-[#000000]">
                    Tina<span className="text-[#D4AF37]"> Plus</span>
                  </h2>
                </div>
              <p className="text-sm leading-relaxed text-[#71717a] mb-6">
                Moda plus size com elegância, conforto e caimento perfeito para todas as mulheres.
              </p>
                <div className="flex items-center gap-4">
                  <a
                href="https://www.instagram.com/tinaplus_?igsh=MXBsazJiNnQ1eWU0dw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full text-[#000000] hover:text-[#D4AF37] transition-colors shadow-sm"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.self !== window.top) {
                      e.preventDefault();
                      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: "https://www.instagram.com/tinaplus_?igsh=MXBsazJiNnQ1eWU0dw==" } }, "*");
                    }
                  }}>

                    <Instagram size={18} />
                    </a>
                    <a
                href="https://wa.me/5511953714884"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full text-[#000000] hover:text-[#D4AF37] transition-colors shadow-sm"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.self !== window.top) {
                      e.preventDefault();
                      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: "https://wa.me/5511953714884" } }, "*");
                    }
                  }}>

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
                  <li><Link href="/sobre-nos" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Sobre nós</Link></li>
                  <li><Link href="/trocas-e-devolucoes" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Trocas e Devoluções</Link></li>
                    <li><Link href="/entregas" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Entregas</Link></li>
                <li><a href="#" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Privacidade</a></li>
              </ul>
            </div>

            {/* Quick Access Column */}
            <div className="lg:col-span-2">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
                Acesso Rápido
              </h3>
                <ul className="space-y-3">
                  <li><a href="/minha-conta" className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors">Minha Conta</a></li>
                </ul>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-4">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#000000] mb-6">
                Atendimento
              </h3>
                <ul className="space-y-4">
                    <li className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Phone size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                        <a 
                          href="tel:+5511953714884" 
                          className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors"
                        >
                          11 95371-4884
                        </a>
                      </div>
                      <div className="flex items-start gap-2 ml-6">
                        <a 
                          href="tel:+5511915291840" 
                          className="text-sm text-[#71717a] hover:text-[#D4AF37] transition-colors"
                        >
                          11 91529-1840
                        </a>
                      </div>
                    </li>
                  <li className="flex items-start gap-2">
                      <Mail size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <span className="text-sm text-[#71717a]">contato@tinaplus.com.br</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#71717a]">
                      <p>Seg a Sex: 7h às 15h</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 border-t border-[#e4e4e7] pt-4 mt-2">
                    <MapPin size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#71717a]">
                      <p className="font-medium text-[#121812]">Nosso endereço:</p>
                      <p>Rua Alexandrino Pedroso, 43</p>
                      <p>Canindé, São Paulo - SP</p>
                    </div>
                  </li>
              </ul>
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
    </footer>);

};

export default Footer;
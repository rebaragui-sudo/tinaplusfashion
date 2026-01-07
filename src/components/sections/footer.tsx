import React from 'react';
import { Instagram, Facebook, MessageCircle, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f2efe9] pt-16 pb-8 text-[#121212] font-sans">
      <div className="container mx-auto px-4">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/icons/logo-hrqhCEHN-1.png" 
                alt="HubPMG" 
                className="h-10 w-auto"
              />
              <h2 className="font-serif text-2xl font-bold">
                Hub<span className="text-[#e11d48]">PMG</span>
              </h2>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed mb-6 max-w-xs">
              Moda plus size com elegância, conforto e caimento perfeito para todas as mulheres.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#121212] hover:text-[#e11d48] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#121212] hover:text-[#e11d48] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#121212] hover:text-[#e11d48] transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Institutional */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Institucional</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Entregas</a></li>
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Privacidade</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Acesso Rápido</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Minha Conta</a></li>
              <li><a href="#" className="text-sm text-[#121212] hover:text-[#e11d48] transition-colors">Administrador do Site</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Atendimento</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-[#e11d48]" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-[#e11d48]" />
                <span className="break-all">contato@hubpmg.com.br</span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-[#71717a]">Seg a Sex: 9h às 18h</p>
                <p className="text-xs text-[#71717a]">Sáb: 9h às 13h</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Novidades</h3>
            <p className="text-sm text-[#71717a] mb-4 leading-snug">
              Receba ofertas exclusivas e lançamentos.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full px-4 py-3 bg-white border border-[#e4e4e7] rounded-md text-sm outline-none focus:border-[#e11d48] transition-colors"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-[#e11d48] text-white font-medium py-3 rounded-md text-sm hover:bg-[#be123c] transition-colors uppercase tracking-wider"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e4e4e7]">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <p className="text-xs text-[#71717a]">
              © 2024 HubPMG. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
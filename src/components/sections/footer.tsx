import React from 'react';
import Image from 'next/image';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const paymentMethods = [
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/visa_2x-1.png", alt: "Visa" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/mastercard_2x-2.png", alt: "Mastercard" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/amex_2x-3.png", alt: "Amex" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/bradesco_2x-4.png", alt: "Bradesco" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/elo_2x-5.png", alt: "Elo" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/hipercard_2x-6.png", alt: "Hipercard" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/pix_2x-7.png", alt: "Pix" },
  ];

  return (
    <footer className="bg-[#3d0021] text-white pt-16">
      <div className="container mx-auto px-4">
        {/* Instagram Section */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] bg-[#9c848d] flex-grow"></div>
            <div className="px-6 flex items-center space-x-2">
              <Instagram size={20} className="text-[#9c848d]" />
              <h2 className="text-xl font-bold font-display uppercase tracking-widest">@csheilamodas_plus</h2>
            </div>
            <div className="h-[1px] bg-[#9c848d] flex-grow"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-[#541d3b] p-4 mb-4 rounded-full">
              <Instagram size={48} className="text-white" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#9c848d] mb-6">Nosso Instagram</p>
            <a 
              href="https://www.instagram.com/csheilamodas_plus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#9c848d] text-[#3d0021] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              Ver Perfil
            </a>
          </div>
        </div>

        {/* Siga-nos Section */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center mb-10">
            <div className="h-[1px] bg-[#9c848d] flex-grow"></div>
            <h2 className="px-6 text-xl font-bold font-display uppercase tracking-widest">Siga-nos</h2>
            <div className="h-[1px] bg-[#9c848d] flex-grow"></div>
          </div>
          <div className="flex justify-center">
            <a href="#" className="bg-[#9c848d] text-[#3d0021] p-3 rounded-full hover:bg-white transition-colors">
              <Instagram size={24} />
            </a>
          </div>
        </div>

        {/* Info Grid (Shipping, Payment, Security) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-[#9c848d]/30 mb-10">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-[#9c848d]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20 8l-3-4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11.5-6.5l2.25 3H15.5v-3h2zm.5 6.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Enviamos suas compras</h3>
            <p className="text-[10px] text-[#9c848d] uppercase mt-1">Entrega em todo o país</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-[#9c848d]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Pague como quiser</h3>
            <p className="text-[10px] text-[#9c848d] uppercase mt-1">Cartões de crédito ou à vista</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-[#9c848d]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Compre com segurança</h3>
            <p className="text-[10px] text-[#9c848d] uppercase mt-1">Seus dados sempre protegidos</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12 border-t border-[#9c848d]/30">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-[#9c848d] pb-2 inline-block">Navegação</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-[11px] uppercase tracking-wider text-[#9c848d] hover:text-white transition-colors">Início</a></li>
              <li><a href="/produtos" className="text-[11px] uppercase tracking-wider text-[#9c848d] hover:text-white transition-colors">Produtos</a></li>
              <li><a href="/contato" className="text-[11px] uppercase tracking-wider text-[#9c848d] hover:text-white transition-colors">Contato</a></li>
              <li><a href="/quem-somos" className="text-[11px] uppercase tracking-wider text-[#9c848d] hover:text-white transition-colors">Quem Somos</a></li>
              <li><a href="/politicas" className="text-[11px] uppercase tracking-wider text-[#9c848d] hover:text-white transition-colors">Política de Troca e Devolução</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-[#9c848d] pb-2 inline-block">Meios de Pagamento</h4>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className="bg-white p-1 flex items-center justify-center h-[28px] w-[38px]">
                  <Image src={method.src} alt={method.alt} width={30} height={20} className="object-contain" />
                </div>
              ))}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-[#9c848d] pb-2 inline-block">Formas de Envio</h4>
            <div className="bg-white p-2 inline-block h-[40px] w-[60px]">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/icons/4190_2x-8.png" 
                alt="Nuvem Envio" 
                width={45} 
                height={25} 
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-[#9c848d] pb-2 inline-block">Contato</h4>
            <ul className="space-y-4 text-[11px] text-[#9c848d]">
              <li className="flex items-center space-x-3">
                <Phone size={14} className="text-[#9c848d]" />
                <span>(11) 93730-8369</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={14} className="text-[#9c848d]" />
                <span>contato.sheilamodasplussize@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={14} className="mt-0.5 text-[#9c848d]" />
                <span>Rua Hannemann, 415 - Galeria Page Brás, Loja 2011 - Canindé, São Paulo - SP | CEP: 03031-040</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#9c848d]/20 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#9c848d] tracking-wider uppercase">
          <p>Copyright Sheila Modas Plus Size - 2026. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span>Criado com</span>
            <div className="opacity-70 grayscale hover:grayscale-0 transition-all">
              <svg className="w-20" viewBox="0 0 100 20" fill="currentColor">
                <path d="M10 2l-2 4-2-4H2v16h2v-8l2 4 2-4v8h2V2h-2z" />
                <text x="15" y="15" className="font-bold">nuvemshop</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
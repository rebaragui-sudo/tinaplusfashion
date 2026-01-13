'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '5511953714884'; // Substitua pelo número real
  const message = encodeURIComponent('Olá! Estava navegando no site e gostaria de tirar uma dúvida.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
    const handleClick = (e: React.MouseEvent) => {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        e.preventDefault();
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*");
      }
    };
  
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
        aria-label="Falar no WhatsApp"
      >
      <MessageCircle className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium whitespace-nowrap">
        Suporte WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;

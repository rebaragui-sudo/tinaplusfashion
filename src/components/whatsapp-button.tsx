'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: 'Suporte 1',
      number: '5511953714884',
      label: '11 95371-4884'
    },
    {
      name: 'Suporte 2',
      number: '5511915291840',
      label: '11 91529-1840'
    }
  ];

  const message = encodeURIComponent('Olá! Estava navegando no site e gostaria de tirar uma dúvida.');

  const handleLinkClick = (e: React.MouseEvent, number: string) => {
    const whatsappUrl = `https://wa.me/${number}?text=${message}`;
    if (typeof window !== 'undefined' && window.self !== window.top) {
      e.preventDefault();
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Options Menu */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={`https://wa.me/${contact.number}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, contact.number)}
              className="bg-white text-[#121812] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-100 hover:bg-gray-50 transition-colors group whitespace-nowrap"
            >
              <div className="bg-[#25D366] p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                <MessageCircle size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">{contact.name}</span>
                <span className="text-sm font-bold">{contact.label}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-500' : 'bg-[#25D366]'
        } text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center relative group`}
        aria-label="Falar no WhatsApp"
      >
        {isOpen ? (
          <X className="h-6 w-6 animate-in spin-in-90 duration-300" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium whitespace-nowrap">
              Suporte WhatsApp
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;

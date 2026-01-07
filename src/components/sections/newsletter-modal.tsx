"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after 1.5 seconds to simulate original page load behavior
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const logoAsset = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/logo-1436884897-1751978062-9dec51dd6ef1f3b700bae55-1.webp";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-[90%] max-w-[480px] bg-burgundy-dark p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 text-white/80 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Logo Section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-6 h-[100px] w-full max-w-[150px]">
            <Image
              src={logoAsset}
              alt="Sheila Modas Plus Size"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          
          <p className="text-center font-sans text-sm tracking-wide text-white mb-6">
            Inscreva-se para receber novidades!
          </p>
        </div>

        {/* Subscription Form */}
        <form 
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Nome Completo"
              className="w-full bg-transparent border border-taupe px-4 py-2 text-white placeholder:text-taupe focus:outline-none focus:ring-1 focus:ring-taupe text-sm font-sans"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="email"
              placeholder="Seu E-mail"
              className="w-full bg-transparent border border-taupe px-4 py-2 text-white placeholder:text-taupe focus:outline-none focus:ring-1 focus:ring-taupe text-sm font-sans"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-taupe text-burgundy-dark font-display font-bold uppercase tracking-[0.2em] py-3 text-[13px] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            INSCREVER-SE
          </button>
        </form>
      </div>

      <style jsx global>{`
        body {
          overflow: ${isOpen ? 'hidden' : 'auto'};
        }
      `}</style>
    </div>
  );
};

export default NewsletterModal;
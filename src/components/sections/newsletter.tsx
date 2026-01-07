"use client";

import React from "react";

/**
 * NewsletterSection Component
 * 
 * A pixel-perfect clone of the newsletter subscription section.
 * Features:
 * - Burgundy color palette (#3d0021)
 * - Roboto Condensed typography for headers
 * - Sharp rectangular corners (0px radius)
 * - Taupe borders (#9c848d)
 */
const NewsletterSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementation for subscription would go here
  };

  return (
    <section className="bg-[#3d0021] py-[60px] px-4 md:px-0">
      <div className="container mx-auto max-w-[1200px]">
        {/* Section Title with Horizontal Rules */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 border-b border-[#9c848d]/40"></div>
          <h2 className="mx-6 text-[24px] font-display font-bold uppercase tracking-wider text-white whitespace-nowrap">
            Nosso Newsletter
          </h2>
          <div className="flex-1 border-b border-[#9c848d]/40"></div>
        </div>

        {/* Newsletter Description */}
        <p className="text-center font-sans text-[14px] text-white/90 mb-6">
          Inscreva-se para receber as últimas novidades.
        </p>

        {/* Subscription Form */}
        <form 
          onSubmit={handleSubmit}
          className="max-w-[400px] mx-auto flex flex-col gap-4"
        >
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome Completo"
              required
              className="w-full bg-[#3d0021] border border-[#9c848d] px-4 py-2.5 text-white placeholder:text-[#9c848d] focus:outline-none focus:ring-1 focus:ring-[#9c848d] transition-all duration-300 font-sans text-sm rounded-none"
            />
            <input
              type="email"
              placeholder="Seu E-mail"
              required
              className="w-full bg-[#3d0021] border border-[#9c848d] px-4 py-2.5 text-white placeholder:text-[#9c848d] focus:outline-none focus:ring-1 focus:ring-[#9c848d] transition-all duration-300 font-sans text-sm rounded-none"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-max mx-auto bg-[#9c848d] text-[#3d0021] font-display font-bold text-[13px] uppercase tracking-[0.2em] py-3 px-10 hover:bg-white transition-colors duration-300 rounded-none cursor-pointer mt-2"
          >
            Inscrever-se
          </button>
        </form>
      </div>

      <style jsx global>{`
        .font-display {
          font-family: "Roboto Condensed", sans-serif;
        }
        .font-sans {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </section>
  );
};

export default NewsletterSection;
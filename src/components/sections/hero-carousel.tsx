"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * HeroCarousel Component
 * 
 * Clones the main hero slider section with pixel-perfect accuracy.
 * Features full-width fashion photography and a dark burgundy theme.
 */

const slides = [
  {
    id: 1,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251023-WA0130-resized-1767802553558.jpg",
    alt: "Tina Plus Fashion Banner 1",
  },
  {
    id: 2,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251020-WA0665-resized-1767802608825.jpg",
    alt: "Tina Plus Fashion Banner 2",
  },
  {
    id: 3,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251020-WA0616-resized-1767802630019.jpg",
    alt: "Tina Plus Fashion Banner 3",
  },
  {
    id: 4,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251015-WA0224-resized-1767802656607.jpg",
    alt: "Tina Plus Fashion Banner 4",
  },
  {
    id: 5,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251010-WA0190-resized-1767802716610.jpg",
    alt: "Tina Plus Fashion Banner 5",
  },
  {
    id: 6,
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20250915-WA0470-resized-1767802776978.jpg",
    alt: "Tina Plus Fashion Banner 6",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
      <section className="relative w-full overflow-hidden bg-[#3d0021]">
          <div className="relative group w-full">
            {/* Carousel Container */}
            <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.4/1] w-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

        {/* Navigation Arrows - Only show if more than one slide */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust/Info Bar Divider */}
      <div className="w-full bg-[#3d0021] border-t border-[#9c848d]/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Shipping Info */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#ffffff] font-display font-bold text-[11px] tracking-[0.15em] uppercase">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M48 448H112c0 26.5 21.5 48 48 48s48-21.5 48-48H432c0 26.5 21.5 48 48 48s48-21.5 48-48h48c17.7 0 32-14.3 32-32V384H560c0-35.3-28.7-64-64-64H432V128c0-17.7-14.3-32-32-32H112C94.3 96 80 110.3 80 128V320H48c-26.5 0-48 21.5-48 48v48c0 17.7 14.3 32 32 32zM432 384h64c0 17.7 14.3 32 32 32s32-14.3 32-32h16v32c0 26.5-21.5 48-48 48s-48-21.5-48-48V384zM160 416c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z" />
                </svg>
                ENVIAMOS SUAS COMPRAS
              </div>
              <p className="text-[#9c848d] text-[10px] tracking-wider uppercase">
                Entrega em todo o país
              </p>
            </div>

            {/* Payment Info */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#ffffff] font-display font-bold text-[11px] tracking-[0.15em] uppercase">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                >
                  <path d="M0 432c0 44.2 35.8 80 80 80h416c44.2 0 80-35.8 80-80V80c0-44.2-35.8-80-80-80H80C35.8 0 0 35.8 0 80v352zm128-288h320v64H128v-64zm32 192h48v48h-48v-48zm128 0h192v48H288v-48z" />
                </svg>
                PAGUE COMO QUISER
              </div>
              <p className="text-[#9c848d] text-[10px] tracking-wider uppercase">
                Cartões de crédito ou à vista
              </p>
            </div>

            {/* Security Info */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#ffffff] font-display font-bold text-[11px] tracking-[0.15em] uppercase">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M400 224h-24v-72C376 68.48 307.5 0 224 0S72 68.48 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" />
                </svg>
                COMPRE COM SEGURANÇA
              </div>
              <p className="text-[#9c848d] text-[10px] tracking-wider uppercase">
                Seus dados sempre protegidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
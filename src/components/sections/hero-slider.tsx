"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slideGroups = [
  [
    '/banners/slide1-img1.jpeg',
    '/banners/slide1-img2.jpeg',
    '/banners/slide1-img3.jpeg',
  ],
  [
    '/banners/slide2-img1.jpeg',
    '/banners/slide2-img2.jpeg',
    '/banners/slide2-img3.jpeg',
  ],
  [
    '/banners/terceiro-1-v2.jpeg',
    '/banners/terceiro-2-v2.jpeg',
    '/banners/terceiro-3-v2.jpeg',
  ],
  [
    '/banners/quarto-5.jpeg',
    '/banners/quarto-6.jpeg',
  ],
  [
    '/banners/quinto-1.jpeg',
    '/banners/quinto-2.jpeg',
    '/banners/quinto-3.jpeg',
  ],
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = slideGroups.length;

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === total - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, total]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? total - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, total]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-[#fcfaf8]">
      {/* Slides */}
      {slideGroups.map((group, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="flex w-full h-full">
            {group.map((url, i) => (
              <div key={i} className="relative flex-1 h-full">
                {url ? (
                  <img
                    src={url}
                    alt={`Banner ${index + 1} foto ${i + 1}`}
                    className={`absolute inset-0 w-full h-full ${
                      index === 3 ? "object-contain" : "object-cover object-top"
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#800020] via-[#a00028] to-[#4a0012] flex items-center justify-center">
                    <div className="text-center p-6">
                      <p className="text-white/90 text-lg md:text-2xl font-light tracking-wide">Tina Plus Fashion</p>
                      <p className="text-white/50 text-xs md:text-sm mt-2">Moda Plus Size</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors focus:outline-none hidden md:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors focus:outline-none hidden md:flex"
        aria-label="Próximo"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slideGroups.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentSlide) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 1000);
              }
            }}
            className={`transition-all duration-500 rounded-full h-2.5 ${
              index === currentSlide
                ? "w-8 bg-[#800020]"
                : "w-2.5 bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
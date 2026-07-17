"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const bannerImages = [
  '/banners/banner-verde-1.jpeg',
  '/banners/banner-vinho-1.jpeg',
  '/banners/banner-preto-1.jpeg',
  '/banners/banner-azul-1.jpeg',
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = bannerImages.length;

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
      {bannerImages.map((url, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={url}
              alt={`Banner ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
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
        {bannerImages.map((_, index) => (
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
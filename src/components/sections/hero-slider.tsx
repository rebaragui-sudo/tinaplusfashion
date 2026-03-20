"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-1-1774030700198.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
  {
    id: 2,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-2-1774030700690.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
  {
    id: 3,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-3-1774030701032.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
  {
    id: 4,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-4-1774030701338.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
  {
    id: 5,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-5-1774030701577.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
  {
    id: 6,
    image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-6-1774030701944.jpg",
    title: "",
    description: "",
    cta: "Ver coleção",
    link: "/",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-[#fcfaf8]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
          
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-contain object-center"
              sizes="100vw"
            />
          </div>

          {/* Text Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 md:px-16 lg:px-24">
              <div 
                className={`max-w-xl transition-all duration-700 transform ${
                  index === currentSlide ? "translate-y-0 opacity-100 ease-out" : "translate-y-8 opacity-0"
                }`}
              >
                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-sm tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-8 font-normal max-w-lg">
                  {slide.description}
                </p>
                <a
                  href={slide.link}
                  className="inline-flex items-center justify-center gap-3 bg-[#800020] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-md font-medium text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg group"
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
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
                ? "w-8 bg-white" 
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
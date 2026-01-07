"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Plus Size Essencial",
    description: "Conforto e caimento perfeito para você",
    buttonText: "Comprar agora",
    link: "/blazers",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png",
  },
  {
    id: 2,
    title: "Liquida até 60% OFF",
    description: "Aproveite as melhores ofertas da temporada",
    buttonText: "Ver ofertas",
    link: "/promocao",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-preto-1-Cf4uBn19-2.png",
  },
  {
    id: 3,
    title: "Novidades da Estação",
    description: "Peças exclusivas que chegaram para você",
    buttonText: "Explorar",
    link: "/blazers",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-mostarda-1-7WQyBaXJ-3.png",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-background">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
          
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className={`max-w-xl transition-all duration-1000 transform ${
                index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                  {slide.description}
                </p>
                <a
                  href={slide.link}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 h-[52px] rounded-md text-lg px-8 shadow-lg group"
                >
                  {slide.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors hidden md:block"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-7 w-7 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors hidden md:block"
        aria-label="Próximo"
      >
        <ChevronRight className="h-7 w-7 text-white" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? "bg-white w-8 h-3" 
                : "bg-white/50 w-3 h-3 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
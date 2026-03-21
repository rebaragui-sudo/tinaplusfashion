"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

// Grupos de imagens — cada grupo aparece junto no banner
const slideGroups = [
  [
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-1-1774030700198.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-2-1774030700690.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s1-3-1774092634046.jpg",
  ],
  [
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-3-1774030701032.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-4-1774030701338.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-7-1774092.jpg",
  ],
  [
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s3-1-1774092521429.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s3-2-1774092521774.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s3-3-1774092521933.jpg",
  ],
  [
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s4-1-1774095290879.png",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s4-2-1774095291464.png",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s4-3-1774095291613.png",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s4-4-1774095291784.png",
  ],
  [
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s5-1-1774095789731.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s5-2-1774095790272.jpg",
    "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/banner-s5-3-1774095790635.jpg",
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
                <Image
                  src={url}
                  alt={`Banner ${index + 1} foto ${i + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-top"
                  sizes={`${Math.round(100 / group.length)}vw`}
                />
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
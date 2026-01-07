import React from 'react';
import Image from 'next/image';

const categories = [
  {
    title: 'Blazers',
    offer: 'ATÉ 60% OFF',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
    href: '/blazers',
    alt: 'Blazers até 60%'
  },
  {
    title: 'Bermudas',
    offer: 'A PARTIR DE 20% OFF',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-mostarda-1-7WQyBaXJ-3.png',
    href: '/bermudas',
    alt: 'Bermudas a partir de 20% OFF'
  },
  {
    title: 'Regatas',
    offer: 'ATÉ 60% OFF',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-branca-BmI6_eQT-4.png',
    href: '/regatas',
    alt: 'Regatas até 60%'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <a 
              key={index}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden block"
            >
              {/* Image with zoom effect */}
              <div className="relative w-full h-full">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                />
              </div>

              {/* Overlay for contrast */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <span className="text-white text-sm tracking-[0.2em] uppercase mb-2 font-medium">
                  {category.title}
                </span>
                
                <h3 className="text-white font-display text-3xl md:text-4xl font-bold uppercase tracking-wide mb-1 leading-tight">
                  {category.offer}
                </h3>

                <button className="mt-6 px-8 py-3 border-2 border-white text-white text-xs md:text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                  COMPRE AGORA
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
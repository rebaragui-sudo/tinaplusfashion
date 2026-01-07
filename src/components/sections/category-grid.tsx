import React from 'react';
import Image from 'next/image';

const categoryPromos = [
  {
    title: 'Blazers',
    discount: 'ATÉ 60% OFF',
    href: '/blazers',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
  },
  {
    title: 'Bermudas',
    discount: 'A PARTIR DE 20% OFF',
    href: '/bermudas',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-mostarda-1-7WQyBaXJ-3.png',
  },
  {
    title: 'Regatas',
    discount: 'ATÉ 60% OFF',
    href: '/regatas',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-branca-BmI6_eQT-4.png',
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryPromos.map((promo, index) => (
            <a
              key={index}
              href={promo.href}
              className="group relative aspect-[4/5] overflow-hidden block w-full"
            >
              {/* Image with hover zoom effect */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={promo.image}
                  alt={`${promo.title} ${promo.discount}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                />
              </div>

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

              {/* Text Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <span className="text-white text-sm tracking-[0.2em] uppercase mb-2 font-medium">
                  {promo.title}
                </span>
                
                <h3 className="text-white font-serif text-3xl md:text-4xl font-bold uppercase tracking-wide mb-1 drop-shadow-sm">
                  {promo.discount}
                </h3>

                {/* Styled Button Overlay */}
                <button className="mt-6 px-8 py-3 border-2 border-white text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-foreground transition-all duration-300">
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
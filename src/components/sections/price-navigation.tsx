import React from 'react';
import Image from 'next/image';

const PriceNavigation = () => {
  const priceCards = [
      {
        title: "7 Regatas",
        price: "99,99",
        href: "/regatas",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-branca-BmI6_eQT-4.png",
        alt: "7 Regatas"
      },
    {
      title: "3 Bermudas",
      price: "129",
      href: "/bermudas",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/bermuda-bege-1-DL2gWBgs-5.png",
      alt: "3 Bermudas"
    },
    {
      title: "2 Conjuntos",
      price: "199",
      href: "/conjuntos",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/IMG-20251023-WA0135-resized-1767868166881.jpg?width=8000&height=8000&resize=contain",
      alt: "2 Conjuntos"
    },
    {
      title: "3 Calças Pantalonas",
      price: "100",
      href: "/calcas",
      image: "https://cqegvercchpziccatyiz.supabase.co/storage/v1/object/public/products/product-images/0.0982356958825551.jpg",
      alt: "3 Calças Pantalonas"
    }
  ];

  return (
    <section className="py-12 bg-[#f5f3f1]/30">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-[24px] md:text-[32px] font-bold mb-8 text-[#000000] font-serif">
          Navegue por Preços
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {priceCards.map((card, index) => (
            <a 
              key={index}
              href={card.href} 
              className="group relative aspect-[3/4] overflow-hidden bg-[#f5f3f1] block"
            >
              <Image 
                src={card.image} 
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-6 bg-gradient-to-t from-white/40 via-transparent to-transparent">
                <span className="text-[#000000] text-sm md:text-base font-medium font-sans">
                  {card.title}
                </span>
                <span className="text-[#800020] text-[10px] md:text-xs font-medium font-sans leading-tight">
                  por
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#000000] text-sm md:text-base font-sans">
                    R$
                  </span>
                  <span className="text-[#000000] text-4xl md:text-6xl font-bold leading-none font-sans tracking-tighter">
                    {card.price}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceNavigation;
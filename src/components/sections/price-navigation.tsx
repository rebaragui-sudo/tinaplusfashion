import React from 'react';
import Image from 'next/image';

const PriceNavigation = () => {
  const priceOffers = [
    {
      title: '2 Regatas',
      price: '99',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-branca-BmI6_eQT-4.png',
      href: '/regatas',
      alt: '2 Regatas por R$ 99'
    },
    {
      title: '3 Bermudas',
      price: '129',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/bermuda-bege-1-DL2gWBgs-5.png',
      href: '/bermudas',
      alt: '3 Bermudas por R$ 129'
    },
    {
      title: '2 Conjuntos',
      price: '199',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
      href: '/conjuntos',
      alt: '2 Conjuntos por R$ 199'
    },
    {
      title: '3 Blazers',
      price: '299',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
      href: '/blazers',
      alt: '3 Blazers por R$ 299'
    }
  ];

  return (
    <section className="py-12 bg-[#f3f4f6]/30">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-[30px] font-serif font-bold mb-8 text-[#09090b]">
          Navegue por Preços
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {priceOffers.map((offer, index) => (
            <a 
              key={index}
              href={offer.href}
              className="group relative aspect-[3/4] overflow-hidden bg-[#f3f4f6] block"
            >
              <Image
                src={offer.image}
                alt={offer.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-6 bg-gradient-to-t from-black/10 to-transparent">
                <span className="text-[#09090b] text-sm md:text-base font-medium font-sans">
                  {offer.title}
                </span>
                <span className="text-[#e11d48] text-xs md:text-sm font-medium font-sans">
                  por
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#09090b] text-sm md:text-base font-sans">
                    R$
                  </span>
                  <span className="text-[#09090b] text-4xl md:text-[60px] font-bold leading-none font-sans">
                    {offer.price}
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
import React from 'react';
import Image from 'next/image';

/**
 * CategoryPreviews Section
 * Renders the bottom category showcase for "Chemises", "Macaquinhos", and "Conjuntos"
 * with large vertical preview images and overlay labels as seen in the final part of the homepage.
 */
const CategoryPreviews: React.FC = () => {
  const categories = [
    {
      title: 'Chemises',
      image: 'https://acdn.mitiendanube.com/stores/002/012/127/themes/common/2-74766967735318536031737122176-574-0.png?1251785566',
      link: '/chemises',
    },
    {
      title: 'Macaquinhos',
      image: 'https://acdn.mitiendanube.com/stores/002/012/127/themes/common/2-88229864273820202161737122176-574-0.png?1251785566',
      link: '/macaquinhos',
    },
    {
      title: 'Conjuntos',
      image: 'https://acdn.mitiendanube.com/stores/002/012/127/themes/common/2-32860471188338779941737122176-574-0.png?1251785566',
      link: '/conjuntos',
    },
  ];

  return (
    <section className="bg-[#3d0021] py-[60px]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <div key={index} className="relative group overflow-hidden">
              <a href={category.link} className="block relative aspect-[1/1.5]">
                {/* Product Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay Title & Button */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center pt-8 pb-4">
                  <div className="bg-[#3d0021]/80 w-[85%] py-6 flex flex-col items-center">
                    <h3 className="text-white font-display text-base font-bold uppercase tracking-wider mb-3">
                      {category.title}
                    </h3>
                    <div className="bg-[#9c848d] text-[#3d0021] text-[11px] font-display font-bold uppercase py-2 px-6 tracking-widest transition-colors duration-300 hover:bg-white cursor-pointer">
                      VER MAIS
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPreviews;
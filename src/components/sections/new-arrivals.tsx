import React from 'react';
import Image from 'next/image';
import { ArrowRight, Heart, ShoppingBag, Eye } from 'lucide-react';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  installments: number;
  installmentValue: number;
  image: string;
  hoverImage?: string;
  sizes: string[];
  extraSizes?: number;
  isNew?: boolean;
  colors?: string[];
}

const newArrivals: Product[] = [
  {
    id: 'n1',
    category: 'blazers',
    name: 'Blazer Linho Premium Bege',
    price: 249.90,
    oldPrice: 399.90,
    discount: 38,
    installments: 10,
    installmentValue: 24.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 1,
    colors: ['#D2B48C'],
  },
  {
    id: 'n2',
    category: 'blazers',
    name: 'Blazer Mostarda Fashion',
    price: 219.90,
    installments: 10,
    installmentValue: 21.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-mostarda-1-7WQyBaXJ-3.png',
    isNew: true,
    sizes: ['46', '48', '50', '52', '54'],
    extraSizes: 2,
    colors: ['#DAA520'],
  },
  {
    id: 'n3',
    category: 'bermudas',
    name: 'Bermuda Alfaiataria Preta',
    price: 109.90,
    installments: 10,
    installmentValue: 10.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png', // Fallback as original black Bermuda not in specific assets
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 1,
    colors: ['#000000'],
  },
  {
    id: 'n4',
    category: 'regatas',
    name: 'Regata Ribana Caramelo',
    price: 54.90,
    installments: 10,
    installmentValue: 5.49,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-caramelo-BfF2mTP4-9.png',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 2,
    colors: ['#8B4513'],
  },
  {
    id: 'n5',
    category: 'bermudas',
    name: 'Bermuda Verde Menta',
    price: 99.90,
    installments: 10,
    installmentValue: 9.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png', // Fallback
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 2,
    colors: ['#98FB98'],
  },
  {
    id: 'n6',
    category: 'blazers',
    name: 'Conjunto Blazer + Bermuda Bege',
    price: 289.90,
    installments: 10,
    installmentValue: 28.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 2,
    colors: ['#F5F5DC'],
  },
  {
    id: 'n7',
    category: 'regatas',
    name: 'Regata Ribana Bege',
    price: 49.90,
    installments: 10,
    installmentValue: 4.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 3,
    colors: ['#F5F5DC'],
  },
  {
    id: 'n8',
    category: 'blazers',
    name: 'Blazer Alongado Bege',
    price: 229.90,
    installments: 10,
    installmentValue: 22.99,
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: 2,
    colors: ['#F5F5DC'],
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#f3f4f6]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-[#09090b] text-white text-[10px] font-bold px-2 py-1 rounded tracking-tight uppercase">
              Novidade
            </span>
          )}
          {product.discount && (
            <span className="bg-[#e11d48] text-white text-[10px] font-bold px-2 py-1 rounded tracking-tight uppercase">
              Até {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.colors && product.colors.map((color, idx) => (
            <div 
              key={idx}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <button className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-[#71717a]" />
          </button>
        </div>

        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <button className="flex-1 h-9 flex items-center justify-center gap-2 bg-white text-[#09090b] text-xs font-semibold rounded-md hover:bg-[#e11d48] hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
            Adicionar
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-md hover:bg-white transition-colors shadow-sm">
            <Eye className="w-4 h-4 text-[#09090b]" />
          </button>
        </div>
      </div>

      <div className="mt-4 px-1">
        <p className="text-[10px] text-[#71717a] uppercase tracking-[0.1em] font-medium mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-[#09090b] line-clamp-1 group-hover:text-[#e11d48] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-[#09090b]">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#71717a] line-through">
              R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-bold text-[#e11d48]">
              -{product.discount}%
            </span>
          )}
        </div>
        
        <p className="text-[11px] text-[#71717a] mt-0.5">
          ou {product.installments}x de R$ {product.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
        </p>

        {/* Size chips */}
        <div className="flex flex-wrap gap-1 mt-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {product.sizes.map((size) => (
            <span 
              key={size}
              className="text-[10px] px-2 py-0.5 bg-[#f3f4f6] text-[#71717a] rounded-sm border border-transparent hover:border-[#e11d48] transition-colors"
            >
              {size}
            </span>
          ))}
          {product.extraSizes && (
            <span className="text-[10px] text-[#71717a] flex items-center ml-1">
              +{product.extraSizes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NewArrivals() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 text-center md:text-left">
          <div>
            <h2 className="font-serif text-[32px] md:text-[36px] font-bold text-[#09090b] mb-2 leading-tight">
              Novidades da Estação
            </h2>
            <p className="text-[#71717a] text-sm md:text-base">
              Peças que acabaram de chegar para compor seu estilo
            </p>
          </div>
          <a 
            href="/novidades" 
            className="mt-6 md:mt-0 flex items-center text-[#e11d48] text-sm font-semibold hover:gap-2 transition-all duration-300 border-b border-[#e11d48] pb-0.5"
          >
            Ver todos 
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More mobile button */}
        <div className="mt-12 flex justify-center md:hidden">
          <button className="px-8 py-3 border border-[#e4e4e7] rounded-md text-sm font-medium text-[#09090b] hover:bg-[#f3f4f6] transition-colors w-full">
            Ver mais produtos
          </button>
        </div>
      </div>
    </section>
  );
}
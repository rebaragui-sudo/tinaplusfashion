import React from 'react';
import Image from 'next/image';
import { ArrowRight, Heart, ShoppingBag, Eye } from 'lucide-react';

interface Product {
  id: string;
  category: string;
  title: string;
  price: number;
  oldPrice?: number;
  installments: string;
  image: string;
  sizes: string[];
  hasPromo?: boolean;
  promoText?: string;
  isNew?: boolean;
}

const newArrivals: Product[] = [
  {
    id: 'n1',
    category: 'blazers',
    title: 'Blazer Linho Premium Bege',
    price: 249.90,
    oldPrice: 399.90,
    installments: 'ou 10x de R$ 24,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    sizes: ['44', '46', '48', '50', '52', '+1'],
    hasPromo: true,
    isNew: true
  },
  {
    id: 'n2',
    category: 'blazers',
    title: 'Blazer Mostarda Fashion',
    price: 219.90,
    installments: 'ou 10x de R$ 21,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-mostarda-1-7WQyBaXJ-3.png',
    sizes: ['46', '48', '50', '52', '54', '+2'],
    isNew: true
  },
  {
    id: 'n3',
    category: 'bermudas',
    title: 'Bermuda Alfaiataria Preta',
    price: 109.90,
    installments: 'ou 10x de R$ 10,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png', // Fallback as specified, though likely should be a black bermuda if available
    sizes: ['44', '46', '48', '50', '52', '+1'],
    isNew: true
  },
  {
    id: 'n4',
    category: 'regatas',
    title: 'Regata Ribana Caramelo',
    price: 54.90,
    installments: 'ou 10x de R$ 5,49 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png',
    sizes: ['44', '46', '48', '50', '52', '+2'],
    isNew: true
  },
  {
    id: 'n5',
    category: 'bermudas',
    title: 'Bermuda Verde Menta',
    price: 99.90,
    installments: 'ou 10x de R$ 9,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png',
    sizes: ['44', '46', '48', '50', '52', '+2'],
    isNew: true
  },
  {
    id: 'n6',
    category: 'blazers',
    title: 'Conjunto Blazer + Bermuda Bege',
    price: 289.90,
    installments: 'ou 10x de R$ 28,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    sizes: ['44', '46', '48', '50', '52', '+2'],
    isNew: true
  },
  {
    id: 'n7',
    category: 'regatas',
    title: 'Regata Ribana Bege',
    price: 49.90,
    installments: 'ou 10x de R$ 4,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-bege-D77zQwJI-10.png',
    sizes: ['44', '46', '48', '50', '52', '+3'],
    isNew: true
  },
  {
    id: 'n8',
    category: 'blazers',
    title: 'Blazer Alongado Bege',
    price: 229.90,
    installments: 'ou 10x de R$ 22,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-3-wxsbI56X-11.png',
    sizes: ['44', '46', '48', '50', '52', '+2'],
    isNew: true
  }
];

const ProductCard = ({ product }: { product: Product }) => (
  <a className="group block h-full flex flex-col" href={`/produto/${product.id}`}>
    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3f1] rounded-lg">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Novidade
          </span>
        )}
        {product.hasPromo && product.oldPrice && (
          <span className="bg-[#800020] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
          </span>
        )}
      </div>

      <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#71717a] hover:bg-white hover:text-[#800020] transition-all shadow-sm">
        <Heart size={20} />
      </button>

      {/* Hover Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block">
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-black text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#800020] hover:text-white transition-colors">
            <ShoppingBag size={18} />
            Adicionar
          </button>
          <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-all">
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>

    <div className="py-4 flex flex-col flex-grow">
      <p className="text-[11px] text-[#71717a] uppercase tracking-widest mb-1 font-semibold">{product.category}</p>
      <h3 className="text-sm font-medium text-black line-clamp-2 mb-2 group-hover:text-[#800020] transition-colors">
        {product.title}
      </h3>
      
      <div className="flex items-baseline gap-2 flex-wrap mb-1">
        <span className="text-lg font-bold text-black">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </span>
        {product.oldPrice && (
          <span className="text-sm text-[#71717a] line-through">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
          </span>
        )}
      </div>
      
      <p className="text-[11px] text-[#71717a]">{product.installments}</p>

      <div className="flex flex-wrap gap-1 mt-3">
        {product.sizes.map((size, idx) => (
          <span key={idx} className="text-[10px] px-2 py-1 bg-[#f5f3f1] rounded text-[#71717a] font-medium min-w-[24px] text-center">
            {size}
          </span>
        ))}
      </div>
    </div>
  </a>
);

const NewArrivals = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-black mb-1">
              Novidades da Estação
            </h2>
            <p className="text-[#71717a] text-sm md:text-base">
              Peças exclusivas que acabaram de chegar
            </p>
          </div>
          <a 
            href="/novidades" 
            className="text-[#800020] text-sm font-bold flex items-center gap-1 hover:underline transition-all"
          >
            Ver todos <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
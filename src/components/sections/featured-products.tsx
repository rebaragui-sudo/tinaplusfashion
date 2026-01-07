import React from 'react';
import { ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';

interface Product {
  id: number;
  category: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  installments: string;
  image: string;
  badges: string[];
  sizes: string[];
  colors?: string[];
}

const products: Product[] = [
  {
    id: 1,
    category: 'blazers',
    name: 'Blazer Alfaiataria Alongado Preto',
    price: 'R$\u00A0189,90',
    originalPrice: 'R$\u00A0299,90',
    discount: '-37%',
    installments: 'ou 10x de R$\u00A018,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-preto-1-Cf4uBn19-2.png',
    badges: ['Até 37% OFF'],
    sizes: ['44', '46', '48', '50', '52', '+2'],
    colors: ['bg-black']
  },
  {
    id: 2,
    category: 'blazers',
    name: 'Blazer Linho Premium Bege',
    price: 'R$\u00A0249,90',
    originalPrice: 'R$\u00A0399,90',
    discount: '-38%',
    installments: 'ou 10x de R$\u00A024,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
    badges: ['Novidade'],
    sizes: ['44', '46', '48', '50', '52', '+1'],
    colors: ['bg-[#f5f3f1]']
  },
  {
    id: 3,
    category: 'bermudas',
    name: 'Bermuda Alfaiataria Bege',
    price: 'R$\u00A0119,90',
    originalPrice: 'R$\u00A0179,90',
    discount: '-33%',
    installments: 'ou 10x de R$\u00A011,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/regata-caramelo-BfF2mTP4-9.png', // Fallback for lack of specific bermuda beige
    badges: ['Até 33% OFF'],
    sizes: ['44', '46', '48', '50', '52', '+2'],
    colors: ['bg-[#d2b48c]']
  },
  {
    id: 4,
    category: 'bermudas',
    name: 'Bermuda Alfaiataria Terracota',
    price: 'R$\u00A099,90',
    originalPrice: 'R$\u00A0149,90',
    discount: '-33%',
    installments: 'ou 10x de R$\u00A09,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/bermuda-terracota-1-BxfyOcTa-6.png',
    badges: ['Até 33% OFF'],
    sizes: ['46', '48', '50', '52', '54', '+2'],
    colors: ['bg-[#a0522d]']
  }
];

export default function FeaturedProductsGrid() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Achados com Preço Especial
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ofertas imperdíveis selecionadas para você
            </p>
          </div>
          <a 
            href="/promocao" 
            className="text-primary font-medium flex items-center text-sm hover:underline transition-all"
          >
            Ver todos <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.badges.map((badge, idx) => (
                    <span 
                      key={idx} 
                      className={`${badge.includes('Novidade') ? 'bg-black' : 'bg-primary'} text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-primary hover:bg-white transition-all shadow-sm">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Hover Add to Cart Action */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold h-10 rounded-md hover:bg-primary hover:text-white transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Adicionar
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-md hover:bg-white transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  {product.category}
                </span>
                <a href={`/produto/${product.id}`} className="group-hover:text-primary transition-colors">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 leading-tight h-10">
                    {product.name}
                  </h3>
                </a>
                
                <div className="flex items-baseline gap-2 flex-wrap mt-auto">
                  <span className="text-lg font-bold text-foreground">{product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                  <span className="text-xs text-primary font-bold">{product.discount}</span>
                </div>
                
                <p className="text-[11px] text-muted-foreground mt-1">
                  {product.installments}
                </p>

                {/* Size Chips */}
                <div className="hidden md:flex gap-1 mt-4 flex-wrap">
                  {product.sizes.map((size, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] px-2 py-1 bg-secondary rounded text-muted-foreground font-medium"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
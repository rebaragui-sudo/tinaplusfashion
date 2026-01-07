import React from 'react';
import { Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  category: string;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  installments: string;
  image: string;
  badge: string;
  sizes: string[];
  extraSizes?: string;
  isNew?: boolean;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    category: 'blazers',
    name: 'Blazer Alfaiataria Alongado Preto',
    price: 'R$\u00A0189,90',
    oldPrice: 'R$\u00A0299,90',
    discount: '-37%',
    installments: 'ou 10x de R$\u00A018,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-preto-1-Cf4uBn19-2.png',
    badge: 'Até 37% OFF',
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: '+2'
  },
  {
    id: 2,
    category: 'blazers',
    name: 'Blazer Linho Premium Bege',
    price: 'R$\u00A0249,90',
    oldPrice: 'R$\u00A0399,90',
    discount: '-38%',
    installments: 'ou 10x de R$\u00A024,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/blazer-bege-1--ZXdRYvY-1.png',
    badge: 'Novidade',
    isNew: true,
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: '+1'
  },
  {
    id: 3,
    category: 'bermudas',
    name: 'Bermuda Alfaiataria Bege',
    price: 'R$\u00A0119,90',
    oldPrice: 'R$\u00A0179,90',
    discount: '-33%',
    installments: 'ou 10x de R$\u00A011,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/bermuda-bege-1-DL2gWBgs-5.png',
    badge: 'Até 33% OFF',
    sizes: ['44', '46', '48', '50', '52'],
    extraSizes: '+2'
  },
  {
    id: 4,
    category: 'bermudas',
    name: 'Bermuda Alfaiataria Terracota',
    price: 'R$\u00A099,90',
    oldPrice: 'R$\u00A0149,90',
    discount: '-33%',
    installments: 'ou 10x de R$\u00A09,99 sem juros',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-hubpmg-com-br/assets/images/bermuda-terracota-1-BxfyOcTa-6.png',
    badge: 'Até 33% OFF',
    sizes: ['46', '48', '50', '52', '54'],
    extraSizes: '+2'
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-lg">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
            product.isNew ? 'bg-black text-white' : 'bg-primary text-white'
          }`}>
            {product.badge}
          </span>
        </div>

        {/* Action Buttons */}
        <button className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-primary hover:bg-white transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>

        {/* Main Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-2">
            <button className="flex-1 h-10 bg-white text-foreground hover:bg-primary hover:text-white transition-colors text-xs font-semibold rounded flex items-center justify-center gap-2 uppercase tracking-tight">
              <ShoppingBag className="w-4 h-4" />
              Adicionar
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm text-foreground hover:bg-white flex items-center justify-center rounded transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 px-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-medium mb-1.5">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-[1.4]">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-lg font-bold text-foreground">{product.price}</span>
          <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">{product.oldPrice}</span>
          <span className="text-xs font-bold text-primary">{product.discount}</span>
        </div>
        
        <p className="text-[11px] text-muted-foreground mb-3">
          {product.installments}
        </p>

        {/* Size Selector Mockup */}
        <div className="hidden md:flex gap-1 flex-wrap mt-2">
          {product.sizes.map((size) => (
            <span 
              key={size}
              className="text-[10px] w-8 h-6 flex items-center justify-center bg-[#f3f4f6]/70 rounded cursor-pointer hover:bg-primary hover:text-white transition-colors text-muted-foreground font-medium"
            >
              {size}
            </span>
          ))}
          {product.extraSizes && (
            <span className="text-[10px] h-6 flex items-center px-1 text-muted-foreground font-medium">
              {product.extraSizes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-foreground leading-tight">
              Achados com Preço Especial
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ofertas imperdíveis selecionadas para você
            </p>
          </div>
          <a 
            href="/promocao" 
            className="text-primary font-semibold text-xs md:text-sm flex items-center gap-1 hover:underline transition-all uppercase tracking-wider"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          {/* Duplicating the row for the 2nd row visual in screenshot */}
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id + 10} product={{
              ...product,
              id: product.id + 10,
              badge: `Até ${30 + product.id}% OFF`,
              isNew: false
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
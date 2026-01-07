import React from 'react';
import Image from 'next/image';

/**
 * ProductGrid Section Component
 * 
 * This component clones the "Destaques" product grid section.
 * It features a centered title with horizontal lines and a grid of product cards.
 * Each card includes a fashion portrait, title, price, installment info, and a buy button.
 */

interface Product {
  id: number;
  title: string;
  price: string;
  installments: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "CONJUNTO REGATA COM SHORTS LISO (GG)",
    price: "R$85,00",
    installments: "12 X DE R$8,61",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 2,
    title: "CONJUNTO REGATA COM SHORTS LISO (G2)",
    price: "R$95,00",
    installments: "12 X DE R$9,63",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 3,
    title: "MACAQUINHO LISO (GG)",
    price: "R$65,00",
    installments: "12 X DE R$6,59",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 4,
    title: "MACAQUINHO LISO (G2)",
    price: "R$75,00",
    installments: "12 X DE R$7,60",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 5,
    title: "CONJUNTO COLETE COM CALÇA PANTALONA LISO (GG)",
    price: "R$95,00",
    installments: "12 X DE R$9,63",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 6,
    title: "CONJUNTO SHORTS SAIA (GG)",
    price: "R$85,00",
    installments: "12 X DE R$8,61",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 7,
    title: "CONJUNTO LISO SHORT E BLUSA COM BOTÃO ENCAPADO (GG)",
    price: "R$85,00",
    installments: "12 X DE R$8,61",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  },
  {
    id: 8,
    title: "CONJUNTO LISO SHORT E BLUSA COM BOTÃO ENCAPADO (G2)",
    price: "R$95,00",
    installments: "12 X DE R$9,63",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ea02e2c1-3719-4f3c-b449-729e57b40008-sheilamodasplussize-com/assets/images/images_2.png"
  }
];

const ProductCard = ({ product }: { product: Product }) => {
    return (
      <div className="flex flex-col items-center group mb-10">
        <div className="relative w-full aspect-fashion overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        <div className="mt-4 flex flex-col items-center text-center w-full px-2">
          <h3 className="text-product-title h-10 line-clamp-2 mb-1 text-foreground">
            {product.title}
          </h3>
          
          <div className="text-price mb-1 text-foreground font-bold">
            {product.price}
          </div>
          
          <div className="text-installment mb-4 text-muted-foreground uppercase tracking-tighter text-[10px]">
            {product.installments}
          </div>
          
          <button 
            className="w-full py-2.5 bg-primary hover:bg-foreground hover:text-background text-primary-foreground font-display font-bold uppercase tracking-widest text-[13px] transition-colors duration-300"
          >
            COMPRAR
          </button>
        </div>
      </div>
    );
  };
  
  export default function ProductGrid() {
    return (
      <section className="py-[60px] bg-background">
        <div className="container mx-auto">
          {/* Section Title with Lines */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex-grow border-b border-border"></div>
            <h2 className="px-6 text-2xl font-display font-bold uppercase tracking-[2px] whitespace-nowrap text-foreground">
              Destaques
            </h2>
            <div className="flex-grow border-b border-border"></div>
          </div>
  
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
  
          {/* View All Button */}
          <div className="mt-12 flex justify-center">
            <button 
              className="px-12 py-3 bg-secondary border border-border hover:bg-primary hover:text-primary-foreground text-foreground font-display font-bold uppercase tracking-widest text-sm transition-all duration-300"
            >
              VER TODOS OS PRODUTOS
            </button>
          </div>
        </div>
      </section>
    );
  }
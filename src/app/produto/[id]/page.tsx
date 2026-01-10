'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Ruler, 
  Truck, 
  RefreshCw, 
  ShieldCheck,
  Loader2,
  ChevronLeft,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

const COLOR_MAP: Record<string, string> = {
  '#e5b791': 'Nude',
  '#000000': 'Preto',
  '#b9b4d2': 'Lavanda',
  '#99b798': 'Verde Menta',
  '#eeb38b': 'Salmão',
  '#fff8ad': 'Amarelo',
  '#573230': 'Marrom',
  '#ccc08f': 'Dourado',
  '#8fa4c4': 'Azul Serenity',
  '#262222': 'Grafite',
  '#ffffff': 'Branco',
  '#b56d08': 'Caramelo',
  '#dacec5': 'Off White',
  '#936a25': 'Ouro',
  '#5c400f': 'Marrom Escuro',
  '#eadcc2': 'Creme',
  '#f3d1d1': 'Rosa Claro',
  '#a38fce': 'Roxo',
  '#9bcbee': 'Azul Bebê',
  '#f7a78d': 'Pêssego',
  '#da1010': 'Vermelho',
  '#9fbe9d': 'Verde Oliva',
  '#136c6b': 'Verde Petróleo',
  '#306991': 'Azul Petróleo',
  '#c35046': 'Terracota',
  '#f2f2e9': 'Marfim',
};

const getColorName = (color: string) => {
  return COLOR_MAP[color.toLowerCase()] || color;
};

const getColorValue = (color: string) => {
  if (color.startsWith('#')) return color;
  // Reverse lookup if it's a name
  const entry = Object.entries(COLOR_MAP).find(([_, name]) => name.toLowerCase() === color.toLowerCase());
  return entry ? entry[0] : color;
};

interface Variant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchProductAndVariants() {
      try {
        setLoading(true);
        const [productRes, variantsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', id)
        ]);

        if (productRes.error) throw productRes.error;
        if (variantsRes.error) throw variantsRes.error;

        setProduct(productRes.data);
        setVariants(variantsRes.data || []);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProductAndVariants();
  }, [id]);

  const updateQuantity = (variantId: string, delta: number, maxStock: number) => {
    setQuantities(prev => {
      const current = prev[variantId] || 0;
      const next = current + delta;
      
      if (next < 0) return prev;
      if (next > maxStock) {
        toast.error(`Apenas ${maxStock} unidades disponíveis em estoque`);
        return prev;
      }
      
      return { ...prev, [variantId]: next };
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedVariants = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    
    if (selectedVariants.length === 0) {
      toast.error('Por favor, selecione pelo menos uma variação');
      return;
    }

    selectedVariants.forEach(([variantId, qty]) => {
      const variant = variants.find(v => v.id === variantId);
      if (variant) {
        addItem(product, qty, variant.size, variant.color);
      }
    });

    setQuantities({});
    toast.success('Produtos adicionados ao carrinho');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-[#800020]" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <a href="/" className="text-[#800020] hover:underline">Voltar para a loja</a>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-xs text-muted-foreground gap-2">
            <a href="/" className="hover:text-foreground">Home</a>
            <ChevronRight size={12} />
            <a href={`/${product.category?.toLowerCase()}`} className="hover:text-foreground capitalize">{product.category}</a>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
              <div className="relative flex-grow aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
                <img 
                  src={allImages[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-[#800020] hover:bg-white transition-all shadow-sm z-10">
                  <Heart size={22} />
                </button>

                {allImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4 md:hidden">
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 md:w-20 lg:w-24 shrink-0">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] w-20 md:w-full rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#800020] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col relative">
              <div className="absolute top-0 right-0">
                <button 
                  className="p-2 text-muted-foreground hover:text-[#800020] transition-colors"
                  title="Compartilhar"
                >
                  <Share2 size={22} />
                </button>
              </div>
              <div className="mb-6 pr-10">
                <span className="text-xs font-bold text-[#800020] uppercase tracking-widest mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    até 12x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 12)}
                  </span>
                </div>
              </div>

                  {/* Variants Grid Table */}
                  <div className="mb-8 overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 border-b border-r text-left font-bold uppercase tracking-tight w-40">
                            Cor
                          </th>
                          {(product.sizes || []).map(size => (
                            <th key={size} className="p-4 border-b text-center font-bold uppercase tracking-tight">
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(product.colors || []).map(color => (
                          <tr key={color} className="border-b last:border-0">
                            <td className="p-4 border-r">
                              <div className="flex flex-col items-center gap-2">
                                <div 
                                  className="w-10 h-10 rounded-full border shadow-inner"
                                  style={{ backgroundColor: getColorValue(color) }}
                                />
                                <span className="text-[10px] font-medium text-center leading-tight uppercase">
                                  {getColorName(color)}
                                </span>
                              </div>
                            </td>
                            {(product.sizes || []).map(size => {
                              const variant = variants.find(v => v.color === color && v.size === size);
                              const quantity = quantities[variant?.id || ''] || 0;
                              const inStock = variant && variant.stock > 0;

                              return (
                                <td 
                                  key={size} 
                                  className={`p-2 text-center min-w-[100px] transition-colors ${
                                    !inStock ? 'bg-gray-100/50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  {inStock ? (
                                    <div className="flex items-center justify-center">
                                      {quantity > 0 ? (
                                        <div className="flex items-center gap-2 bg-white border rounded-full p-1 shadow-sm">
                                          <button 
                                            onClick={() => updateQuantity(variant.id, -1, variant.stock)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#800020] transition-colors"
                                          >
                                            <Minus size={14} />
                                          </button>
                                          <span className="w-6 font-bold text-[#800020]">{quantity}</span>
                                          <button 
                                            onClick={() => updateQuantity(variant.id, 1, variant.stock)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#800020] transition-colors"
                                          >
                                            <Plus size={14} />
                                          </button>
                                        </div>
                                      ) : (
                                        <button 
                                          onClick={() => updateQuantity(variant.id, 1, variant.stock)}
                                          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#800020] hover:text-[#800020] hover:bg-white transition-all group"
                                        >
                                          <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full opacity-20">
                                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                        <div className="w-full h-[2px] bg-gray-300 rotate-45" />
                                      </div>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

              <div className="flex flex-col gap-3 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-14 bg-[#800020] hover:bg-[#600018] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#800020]/10"
                >
                  <ShoppingBag size={20} />
                  ADICIONAR AO CARRINHO
                </button>
              </div>

              <div className="prose prose-sm max-w-none my-8">
                <h3 className="text-sm font-bold uppercase mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || "Este produto não possui descrição detalhada."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-b">
                <div className="flex items-start gap-3">
                  <Truck className="text-[#800020] shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold uppercase">Envio para todo o Brasil</h4>
                    <p className="text-[10px] text-muted-foreground">Entregas rápidas e seguras</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="text-[#800020] shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold uppercase">Troca Fácil</h4>
                    <p className="text-[10px] text-muted-foreground">Até 7 dias para devolução</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-[#800020] shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold uppercase">Compra Segura</h4>
                    <p className="text-[10px] text-muted-foreground">Dados protegidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

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

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold uppercase tracking-tight">
                          Cor: <span className="text-muted-foreground font-normal ml-1">{selectedColor || 'Selecione'}</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {product.colors.map((color) => {
                          const available = isColorAvailable(color);
                          const isSelected = selectedColor === color;
                          return (
                            <button
                              key={color}
                              onClick={() => available && setSelectedColor(color)}
                              className={`group relative flex flex-col items-center gap-2 transition-all ${
                                !available ? 'cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div 
                                className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all flex items-center justify-center ${
                                  isSelected 
                                    ? 'border-[#800020] scale-105 shadow-md' 
                                    : 'border-transparent group-hover:border-gray-300'
                                }`}
                              >
                                <div 
                                  className={`w-full h-full rounded-full shadow-inner relative overflow-hidden ${
                                    !available ? 'opacity-30' : ''
                                  }`} 
                                  style={{ backgroundColor: color }}
                                >
                                  {!available && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-[120%] h-[1px] bg-black rotate-45 opacity-60" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold uppercase tracking-tight">
                        Tamanho: <span className="text-muted-foreground font-normal ml-1">{selectedSize || 'Selecione'}</span>
                      </label>
                      <button className="text-xs text-[#800020] flex items-center gap-1 hover:underline font-medium">
                        <Ruler size={14} /> Tabela de medidas
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(product.sizes || []).map((size) => {
                        const available = isSizeAvailable(size);
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => available && setSelectedSize(size)}
                            className={`h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-md border text-sm font-bold transition-all relative overflow-hidden ${
                              isSelected 
                                ? 'bg-[#800020] text-white border-[#800020]' 
                                : available 
                                  ? 'border-gray-200 hover:border-[#800020] text-foreground hover:text-[#800020]' 
                                  : 'border-gray-100 text-gray-300 bg-gray-50/50 cursor-not-allowed'
                            }`}
                          >
                            {size}
                            {!available && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[140%] h-[1px] bg-gray-300 rotate-45" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
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

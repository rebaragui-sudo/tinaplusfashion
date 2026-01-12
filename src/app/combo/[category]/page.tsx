
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { Loader2, Check, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getColorName, getColorValue } from '@/lib/colors';

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string;
  colors?: string[];
  sizes?: string[];
}

interface SelectedItem {
  id: string;
  name: string;
  image_url: string;
  color?: string;
  size?: string;
  tempId: string; // To handle duplicate products with different options
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Trash2 } from 'lucide-react';

function ComboSelectionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addCombo } = useCart();
  
  const categorySlug = params.category as string;
  const quantityRequired = parseInt(searchParams.get('q') || '3');
  const totalPrice = parseFloat(searchParams.get('p') || '100');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  
  // Selection Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        // Match category (handling common variations)
        let categoryFilter = categorySlug;
        if (categorySlug === 'calcas') categoryFilter = 'calça';
        
        query = query.ilike('category', `%${categoryFilter}%`);

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug]);

  const openSelectionModal = (product: Product) => {
    if (selectedItems.length >= quantityRequired) {
      toast.error(`Você já selecionou o limite de ${quantityRequired} itens.`);
      return;
    }
    setCurrentProduct(product);
    setSelectedColor(product.colors?.[0] || "");
    setSelectedSize(product.sizes?.[0] || "");
    setItemQuantity(1);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = () => {
    if (!currentProduct) return;
    
    const remainingSlots = quantityRequired - selectedItems.length;
    const finalQuantity = Math.min(itemQuantity, remainingSlots);

    const newItems: SelectedItem[] = [];
    for (let i = 0; i < finalQuantity; i++) {
      newItems.push({
        id: currentProduct.id,
        name: currentProduct.name,
        image_url: currentProduct.image_url,
        color: selectedColor,
        size: selectedSize,
        tempId: `${currentProduct.id}-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`
      });
    }

    setSelectedItems(prev => [...prev, ...newItems]);
    setIsModalOpen(false);
    
    if (finalQuantity < itemQuantity) {
      toast.warning(`Apenas ${finalQuantity} itens foram adicionados para não exceder o limite do combo.`);
    }
  };

  const removeSelectedItem = (tempId: string) => {
    setSelectedItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleAddCombo = () => {
    if (selectedItems.length !== quantityRequired) {
      toast.error(`Por favor, selecione ${quantityRequired} itens para o combo.`);
      return;
    }

    addCombo({
      name: `Combo ${quantityRequired} ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`,
      price: totalPrice,
      subItems: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        image_url: item.image_url,
        color: item.color,
        size: item.size
      }))
    });

    router.push('/');
  };

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <main className="flex-grow pt-8 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Monte seu Combo: {quantityRequired} por {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione {quantityRequired} produtos da lista abaixo para aproveitar a oferta.
          </p>
        </div>

        {/* Status Bar */}
        <div className="sticky top-20 z-30 bg-white border-b py-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(quantityRequired)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    i < selectedItems.length 
                      ? 'bg-[#800020] border-[#800020] text-white' 
                      : 'bg-white border-muted text-muted-foreground'
                  }`}
                >
                  {i < selectedItems.length ? <Check size={16} /> : i + 1}
                </div>
              ))}
            </div>
            <span className="font-medium text-sm hidden md:inline">
              {selectedItems.length} de {quantityRequired} selecionados
            </span>
          </div>

          <Button 
            onClick={handleAddCombo}
            disabled={selectedItems.length !== quantityRequired}
            className="bg-[#800020] hover:bg-[#600018] text-white"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Adicionar Combo ao Carrinho
          </Button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <Loader2 className="animate-spin text-[#800020]" size={40} />
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => {
                const selectionCount = selectedItems.filter(item => item.id === product.id).length;
                
                return (
                  <div 
                    key={product.id}
                    onClick={() => openSelectionModal(product)}
                    className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 transition-all ${
                      selectionCount > 0 ? 'border-[#800020]' : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-secondary">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {selectionCount > 0 && (
                        <div className="absolute top-2 right-2 bg-[#800020] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          {selectionCount}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="text-xs font-medium text-foreground line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex gap-1">
                        {product.colors?.slice(0, 3).map((color, i) => (
                          <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: getColorValue(color) }} title={getColorName(color)} />
                        ))}
                        {product.colors && product.colors.length > 3 && <span className="text-[10px] text-muted-foreground">+{product.colors.length - 3}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Items Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white border rounded-lg p-4 sticky top-40">
                <h3 className="font-bold mb-4 border-b pb-2">Itens Selecionados ({selectedItems.length}/{quantityRequired})</h3>
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum item selecionado</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {selectedItems.map((item) => (
                      <div key={item.tempId} className="flex gap-3 items-center group">
                        <img src={item.image_url} className="w-12 h-16 object-cover rounded" />
                        <div className="flex-grow">
                          <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                          <div className="flex gap-2 text-[10px] text-muted-foreground">
                            {item.color && <span>Cor: {item.color}</span>}
                            {item.size && <span>Tam: {item.size}</span>}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeSelectedItem(item.tempId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-xl font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">Tente buscar por outra categoria ou volte mais tarde.</p>
          </div>
        )}

        {/* Selection Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Escolha as opções</DialogTitle>
            </DialogHeader>
            {currentProduct && (
              <div className="grid gap-6 py-4">
                <div className="flex gap-4">
                  <img src={currentProduct.image_url} alt={currentProduct.name} className="w-24 h-32 object-cover rounded-md" />
                  <div>
                    <h4 className="font-bold text-lg">{currentProduct.name}</h4>
                    <p className="text-sm text-muted-foreground">Adicione ao seu combo</p>
                  </div>
                </div>

                {currentProduct.colors && currentProduct.colors.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Cor disponível</Label>
                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                      {currentProduct.colors.map((color) => (
                        <div key={color} className="flex items-center space-x-2">
                          <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                          <Label
                            htmlFor={`color-${color}`}
                            className={`px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all ${
                              selectedColor === color ? 'bg-[#800020] text-white border-[#800020]' : 'hover:bg-muted'
                            }`}
                          >
                            {color}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Tamanho</Label>
                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                      {currentProduct.sizes.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                          <Label
                            htmlFor={`size-${size}`}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer text-sm transition-all ${
                              selectedSize === size ? 'bg-[#800020] text-white border-[#800020]' : 'hover:bg-muted'
                            }`}
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>Quantidade</Label>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="font-bold text-lg w-8 text-center">{itemQuantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        const remaining = quantityRequired - selectedItems.length;
                        setItemQuantity(Math.min(remaining, itemQuantity + 1));
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Restam {quantityRequired - selectedItems.length} espaços
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleConfirmSelection} className="w-full bg-[#800020] hover:bg-[#600018] text-white">
                Confirmar Escolha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default function ComboSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-[#800020]" size={40} /></div>}>
        <ComboSelectionContent />
      </Suspense>
      <Footer />
    </div>
  );
}

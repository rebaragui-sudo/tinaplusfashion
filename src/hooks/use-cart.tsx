'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  size?: string;
  color?: string;
  cartId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number, size?: string, color?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate a unique ID for a product variation
const generateCartId = (productId: string, size?: string, color?: string): string => {
  if (!productId) return `unknown-${Math.random().toString(36).substring(2, 9)}`;
  const s = size && typeof size === 'string' ? size.trim().toLowerCase() : 'no-size';
  const c = color && typeof color === 'string' ? color.trim().toLowerCase() : 'no-color';
  return `cart-${productId}-${s}-${c}`.replace(/-+/g, '-');
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tina-plus-cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        
        if (Array.isArray(parsed)) {
          const migratedItems: CartItem[] = [];
          const seenIds = new Set<string>();
          
          parsed.forEach((item: any) => {
            const productId = item.id || item.productId;
            if (!productId) return;

            const cartId = generateCartId(productId, item.size, item.color);
            
            if (!seenIds.has(cartId)) {
              seenIds.add(cartId);
              migratedItems.push({
                id: productId,
                name: item.name || 'Produto',
                price: typeof item.price === 'number' ? item.price : 0,
                image_url: item.image_url || '',
                quantity: typeof item.quantity === 'number' ? item.quantity : 1,
                size: item.size || undefined,
                color: item.color || undefined,
                cartId: cartId
              });
            } else {
              const existingIndex = migratedItems.findIndex(i => i.cartId === cartId);
              if (existingIndex > -1) {
                migratedItems[existingIndex].quantity += (typeof item.quantity === 'number' ? item.quantity : 1);
              }
            }
          });
          
          setItems(migratedItems);
        }
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tina-plus-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: any, quantity: number = 1, size?: string, color?: string) => {
    if (!product) {
      console.error('addItem called without product');
      return;
    }
    
    const productId = product.id || product.productId;
    if (!productId) {
      console.error('addItem called with product but no ID', product);
      return;
    }
    
    const cartId = generateCartId(productId, size, color);
    console.log('Adding item to cart:', { productId, cartId, size, color });
    
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.cartId === cartId);

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        toast.success(`Quantidade de ${product.name || 'produto'} atualizada`);
        return newItems;
      }

      toast.success(`${product.name || 'Produto'} adicionado ao carrinho`);
      return [...prevItems, { 
        id: productId, 
        name: product.name || 'Produto', 
        price: product.price || 0, 
        image_url: product.image_url || '', 
        quantity, 
        size: size || undefined, 
        color: color || undefined,
        cartId
      }];
    });
    
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    if (!cartId) return;
    
    setItems((prevItems) => {
      const newItems = prevItems.filter(item => item.cartId !== cartId && item.id !== cartId);
      if (newItems.length < prevItems.length) {
        toast.info('Item removido do carrinho');
      }
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (!cartId) return;
    
    if (quantity < 1) {
      removeItem(cartId);
      return;
    }
    
    setItems((prevItems) => {
      return prevItems.map((item) => 
        item.cartId === cartId 
          ? { ...item, quantity } 
          : item
      );
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Carrinho esvaziado');
  }, []);

  const totalItems = items.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

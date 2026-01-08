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
  const s = size ? size.trim().toLowerCase() : 'no-size';
  const c = color ? color.trim().toLowerCase() : 'no-color';
  return `${productId}-${s}-${c}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
      const savedCart = localStorage.getItem('tina-plus-cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            const migratedItems: CartItem[] = [];
            const seenIds = new Set<string>();
            
            parsed.forEach((item: any) => {
              const productId = item.id || item.productId;
              if (!productId) return;

              const cartId = item.cartId || generateCartId(productId, item.size, item.color);
              
              if (!seenIds.has(cartId)) {
                seenIds.add(cartId);
                migratedItems.push({
                  id: productId,
                  name: item.name || 'Produto',
                  price: item.price || 0,
                  image_url: item.image_url || '',
                  quantity: item.quantity || 1,
                  size: item.size,
                  color: item.color,
                  cartId: cartId
                });
              } else {
                const existingIndex = migratedItems.findIndex(i => i.cartId === cartId);
                if (existingIndex > -1) {
                  migratedItems[existingIndex].quantity += (item.quantity || 1);
                }
              }
            });
            
            setItems(migratedItems);
          }
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
      setIsLoaded(true);
    }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tina-plus-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: any, quantity: number = 1, size?: string, color?: string) => {
    if (!product || !product.id) return;
    
    const cartId = generateCartId(product.id, size, color);
    
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.cartId === cartId);

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        toast.success(`Quantidade de ${product.name} atualizada`);
        return newItems;
      }

      toast.success(`${product.name} adicionado ao carrinho`);
      return [...prevItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        quantity, 
        size, 
        color,
        cartId
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    if (!cartId) return;
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.cartId !== cartId);
      if (newItems.length !== prevItems.length) {
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
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

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

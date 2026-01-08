'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  return `${productId}-${size || 'no-size'}-${color || 'no-color'}`;
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
        
        // Ensure all items have a valid cartId and de-duplicate if necessary
        const migratedMap = new Map<string, CartItem>();
        
        parsed.forEach((item: any) => {
          // Re-generate cartId to ensure it's always correct and unique per variation
          const cartId = generateCartId(item.id, item.size, item.color);
          
          if (migratedMap.has(cartId)) {
            // Merge quantities for the same variation
            const existing = migratedMap.get(cartId)!;
            migratedMap.set(cartId, {
              ...existing,
              quantity: existing.quantity + (item.quantity || 1)
            });
          } else {
            migratedMap.set(cartId, {
              ...item,
              cartId,
              quantity: item.quantity || 1
            });
          }
        });
        
        setItems(Array.from(migratedMap.values()));
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

  const addItem = (product: any, quantity: number = 1, size?: string, color?: string) => {
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
  };

  const removeItem = (cartId: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.cartId !== cartId)
    );
    toast.info('Item removido do carrinho');
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(cartId);
      return;
    }
    
    setItems((prevItems) => {
      const itemExists = prevItems.some(item => item.cartId === cartId);
      if (!itemExists) return prevItems;
      
      return prevItems.map((item) => 
        item.cartId === cartId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

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

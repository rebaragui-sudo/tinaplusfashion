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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('tina-plus-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Migration: Add cartId to old items if missing
        const migrated = parsed.map((item: any) => ({
          ...item,
          cartId: item.cartId || `${item.id}-${item.size || ''}-${item.color || ''}`
        }));
        setItems(migrated);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('tina-plus-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity: number = 1, size?: string, color?: string) => {
    const cartId = `${product.id}-${size || ''}-${color || ''}`;
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartId === cartId);

      if (existingItem) {
        toast.success(`Quantidade de ${product.name} atualizada`);
        return prevItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
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
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) => 
        item.cartId === cartId 
          ? { ...item, quantity } 
          : item
      )
    );
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

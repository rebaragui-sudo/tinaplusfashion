'use client';

import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowLeft, Truck, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, isOpen, setIsOpen } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('correios');
  const [shippingData, setShippingData] = useState({
    nome: '',
    estado: '',
    cidade: '',
    celular: ''
  });

  const handleFinish = () => {
    if (shippingMethod === 'onibus') {
      if (!shippingData.nome || !shippingData.estado || !shippingData.cidade || !shippingData.celular) {
        toast.error('Por favor, preencha todos os dados de envio');
        return;
      }
    }
    
    toast.success('Pedido recebido! Entraremos em contato para finalizar o pagamento.');
    setIsOpen(false);
    setIsCheckout(false);
  };

  const renderCartItems = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-sm font-medium text-[#121812]">
                  <h3 className="line-clamp-1">{item.name}</h3>
                  <p className="ml-4">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-[#71717a]">
                  {item.size && `Tam: ${item.size}`} {item.color && `| Cor: ${item.color}`}
                </p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center border border-gray-200 rounded-md">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:text-[#800020] disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-xs font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:text-[#800020]"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-medium text-[#800020] hover:text-[#a00028] flex items-center gap-1 text-xs"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderCheckout = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#800020]" />
            Forma de Envio
          </h3>
          <RadioGroup 
            value={shippingMethod} 
            onValueChange={setShippingMethod}
            className="space-y-3"
          >
            <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${shippingMethod === 'correios' ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
              <RadioGroupItem value="correios" id="correios" className="text-[#800020]" />
              <Label htmlFor="correios" className="flex-grow cursor-pointer">
                <div className="font-bold">Correios (PAC/SEDEX)</div>
                <div className="text-xs text-muted-foreground">Cálculo baseado no seu CEP</div>
              </Label>
              <Truck className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${shippingMethod === 'onibus' ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
              <RadioGroupItem value="onibus" id="onibus" className="text-[#800020]" />
              <Label htmlFor="onibus" className="flex-grow cursor-pointer">
                <div className="font-bold">Ônibus ou Transportadora</div>
                <div className="text-xs text-muted-foreground">Ideal para compras no atacado</div>
              </Label>
              <Bus className="h-5 w-5 text-gray-400" />
            </div>
          </RadioGroup>
        </div>

        {shippingMethod === 'onibus' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Dados para Envio</h3>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="nome" className="text-xs">Nome</Label>
                <Input 
                  id="nome" 
                  placeholder="Nome completo ou da empresa" 
                  value={shippingData.nome}
                  onChange={(e) => setShippingData({...shippingData, nome: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="estado" className="text-xs">Estado</Label>
                  <Input 
                    id="estado" 
                    placeholder="Ex: SP" 
                    value={shippingData.estado}
                    onChange={(e) => setShippingData({...shippingData, estado: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cidade" className="text-xs">Cidade</Label>
                  <Input 
                    id="cidade" 
                    placeholder="Ex: São Paulo" 
                    value={shippingData.cidade}
                    onChange={(e) => setShippingData({...shippingData, cidade: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="celular" className="text-xs">Número de Celular (WhatsApp)</Label>
                <Input 
                  id="celular" 
                  placeholder="(00) 00000-0000" 
                  value={shippingData.celular}
                  onChange={(e) => setShippingData({...shippingData, celular: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setIsCheckout(false);
    }}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-4">
            {isCheckout && (
              <button 
                onClick={() => setIsCheckout(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              {isCheckout ? (
                'Finalizar Pedido'
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                  Meu Carrinho
                  <span className="text-sm font-sans font-normal text-muted-foreground">
                    ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                  </span>
                </>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#f5f3f1] rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-[#71717a]" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#121812]">Seu carrinho está vazio</p>
                <p className="text-sm text-[#71717a]">Que tal dar uma olhada nas nossas novidades?</p>
              </div>
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-[#121812] hover:bg-[#800020] text-white"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            isCheckout ? renderCheckout() : renderCartItems()
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-4 border-t bg-[#f9f9f9] flex-col gap-4">
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-[#71717a]">Subtotal</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#71717a]">Frete</span>
                <span className="text-[#008000] font-medium">
                  {shippingMethod === 'onibus' ? 'A combinar' : 'Grátis*'}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold text-[#121812]">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                </span>
              </div>
              {!isCheckout && (
                <p className="text-[10px] text-[#71717a] text-center mt-2 italic">
                  *Frete grátis para compra mínima de R$ 350,00
                </p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Button 
                className="w-full bg-[#121812] hover:bg-[#800020] text-white py-6 text-base font-bold uppercase tracking-wider"
                onClick={() => {
                  if (isCheckout) {
                    handleFinish();
                  } else {
                    setIsCheckout(true);
                  }
                }}
              >
                {isCheckout ? 'Confirmar Pedido' : 'Finalizar Compra'}
              </Button>
              {!isCheckout && (
                <Button 
                  variant="outline"
                  className="w-full border-[#121812] text-[#121812] hover:bg-[#f5f3f1]"
                  onClick={() => setIsOpen(false)}
                >
                  Continuar Comprando
                </Button>
              )}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

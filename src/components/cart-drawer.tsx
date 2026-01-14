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
import { useAuth } from '@/hooks/use-auth';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowLeft, Truck, Bus, Loader2, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getColorName } from '@/lib/colors';

    const CartDrawer = () => {
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const { items, removeItem, updateQuantity, totalPrice, totalItems, isOpen, setIsOpen, clearCart } = useCart();
    const { user } = useAuth();
    const [isCheckout, setIsCheckout] = useState(false);

    // Auto-open drawer if redirecting from login/register checkout
    React.useEffect(() => {
      if (searchParams?.get('checkout') === 'true') {
        setIsOpen(true);
        setIsCheckout(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }, [searchParams]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculatedOptions, setCalculatedOptions] = useState<{id: string, label: string, price: number, days: string}[]>([]);
      const [shippingData, setShippingData] = useState({
        nome: '',
        cpf: '',
        estado: '',
        cidade: '',
        celular: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: ''
      });

    // Load profile data if user is logged in
    React.useEffect(() => {
      if (user) {
        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setShippingData(prev => ({
              ...prev,
              nome: data.full_name || '',
              cpf: data.cpf || '',
              celular: data.phone || '',
              cep: data.address?.cep || '',
              endereco: data.address?.street || '',
              numero: data.address?.number || '',
              bairro: data.address?.neighborhood || '',
              cidade: data.address?.city || '',
              estado: data.address?.state || '',
            }));
          }
        };
        fetchProfile();
      }
    }, [user]);

    const formatCPF = (value: string) => {
      const clean = value.replace(/\D/g, '');
      if (clean.length <= 11) {
        return clean
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      }
      return clean;
    };


  // Calculate shipping based on volume (quantity) and method
  React.useEffect(() => {
    if (shippingMethod === 'onibus') {
      setShippingPrice(0);
      return;
    }

    const selectedOption = calculatedOptions.find(opt => opt.id === shippingMethod);
    if (selectedOption) {
      setShippingPrice(selectedOption.price);
    } else if (shippingMethod !== 'onibus') {
      setShippingPrice(0);
    }
  }, [totalItems, shippingMethod, calculatedOptions]);

  // Trigger calculation when CEP is valid
  React.useEffect(() => {
    const cleanCep = shippingData.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      handleCalculateShipping(cleanCep);
    } else {
      setCalculatedOptions([]);
      if (shippingMethod !== 'onibus') {
        setShippingMethod('');
      }
    }
  }, [shippingData.cep, totalItems]);

  const handleCalculateShipping = async (cep: string) => {
    setIsCalculating(true);
    
    try {
      // Calculate package based on items
      // Using default values from DB as most products share them
      const totalWeight = items.reduce((sum, item) => sum + (0.3 * (item.quantity || 1)), 0);
      const totalHeight = items.reduce((sum, item) => sum + (2 * (item.quantity || 1)), 0);
      
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cep,
          package: {
            weight: totalWeight,
            height: Math.max(10, totalHeight), // Min height for box
            width: 20,
            length: 30,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular frete');
      }

      if (Array.isArray(data)) {
        const options = data.map((opt: any) => ({
          id: opt.name.toLowerCase().replace(/\s+/g, '-'),
          label: opt.name,
          price: opt.price,
          days: `Entrega em até ${opt.delivery_time} ${opt.delivery_time === 1 ? 'dia útil' : 'dias úteis'}`
        }));
        setCalculatedOptions(options);
      }
    } catch (error: any) {
      console.error('Cart shipping calculation error:', error);
      toast.error('Erro ao calcular frete. Verifique o CEP.');
      setCalculatedOptions([]);
    } finally {
      setIsCalculating(false);
    }
  };

    const handleFinish = async () => {
      if (shippingMethod === 'onibus') {
        if (!shippingData.nome || !shippingData.cpf || !shippingData.estado || !shippingData.cidade || !shippingData.celular) {
          toast.error('Por favor, preencha todos os dados de envio');
          return;
        }
      } else {
        if (!shippingData.nome || !shippingData.cpf || !shippingData.cep || !shippingData.endereco || !shippingData.numero || !shippingData.celular) {
          toast.error('Por favor, preencha os dados de entrega');
          return;
        }
      }

      const cleanCpf = shippingData.cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11) {
        toast.error('CPF inválido');
        return;
      }


    setIsSubmitting(true);
    
      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .insert([
            {
                total_price: totalPrice + shippingPrice,
                shipping_method: shippingMethod,
                shipping_price: shippingPrice,
                items: items,
                shipping_data: shippingData,
                status: 'pending',
                user_id: user?.id
              }
          ])
          .select()
          .single();

        if (error) throw error;

        // Call InfinitePay API
        const response = await fetch('/api/checkout/infinitepay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            items: items,
            customer: shippingData,
            totalPrice: totalPrice,
            shippingPrice: shippingPrice,
            redirectUrl: `${window.location.origin}/pedidos?orderId=${orderData.id}`
          }),
        });

        const paymentData = await response.json();

        if (!response.ok) {
          throw new Error(paymentData.error || 'Erro ao gerar link de pagamento');
        }
        
        toast.success('Pedido recebido! Redirecionando para o pagamento...');
        clearCart();
        setIsOpen(false);
        setIsCheckout(false);

        // Redirect to InfinitePay checkout link
        if (paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          router.push('/pedidos');
        }
      } catch (error: any) {
        console.error('Error saving order or generating payment:', error);
        toast.error(error.message || 'Erro ao processar pedido.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const isShippingSelected = shippingMethod !== '';
    const canFinishCheckout = isShippingSelected && (
      shippingMethod === 'onibus' 
        ? (shippingData.nome && shippingData.cpf && shippingData.estado && shippingData.cidade && shippingData.celular)
        : (shippingData.nome && shippingData.cpf && shippingData.cep && shippingData.endereco && shippingData.numero && shippingData.celular)
    );

    const renderCartItems = () => (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {items.map((item, index) => {
            // Ensure we have a unique key by combining cartId and index
            // This prevents React "same key" errors even if data is corrupted
            const uniqueKey = `${item.cartId || item.id}-${index}`;
            return (
              <div key={uniqueKey} className="flex gap-4">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-[#121812]">
                        <h3 className="line-clamp-1">{item.name || 'Produto'}</h3>
                        <p className="ml-4">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || 0)}
                        </p>
                      </div>
                      {item.isCombo ? (
                        <div className="mt-1 space-y-1">
                          <p className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">Itens inclusos:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.subItems?.map((subItem, idx) => (
                              <div key={idx} className="bg-secondary px-1.5 py-0.5 rounded text-[9px] text-muted-foreground border">
                                {subItem.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-[#71717a]">
                          {item.size && `Tam: ${item.size}`} {item.color && `| Cor: ${getColorName(item.color)}`}
                        </p>
                      )}
                    </div>

                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                          className="p-1 hover:text-[#800020] disabled:opacity-30"
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-xs font-medium w-8 text-center">{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                          className="p-1 hover:text-[#800020]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Removing item:', item.cartId);
                            removeItem(item.cartId);
                          }}
                          className="font-medium text-[#800020] hover:text-[#a00028] flex items-center gap-1 text-xs"
                        >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );

  const renderCheckout = () => {
    if (!user) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#f5f3f1] rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-[#800020]" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-[#121812]">Identificação Necessária</p>
            <p className="text-sm text-[#71717a]">
              Para sua segurança e para acompanhar seu pedido, você precisa estar logado.
            </p>
          </div>
          <div className="w-full space-y-3">
            <Button 
              onClick={() => {
                setIsOpen(false);
                router.push('/login?redirect=checkout');
              }}
              className="w-full bg-[#121812] hover:bg-[#800020] text-white py-6"
            >
              Fazer Login
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                router.push('/cadastro?redirect=checkout');
              }}
              className="w-full border-[#121812] text-[#121812] py-6"
            >
              Criar uma Conta
            </Button>
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase flex items-center gap-2">
              <User className="h-4 w-4 text-[#800020]" />
              Dados Pessoais
            </h3>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="nome_entrega" className="text-xs">Nome Completo</Label>
                <Input 
                  id="nome_entrega" 
                  placeholder="Seu nome completo" 
                  value={shippingData.nome}
                  onChange={(e) => setShippingData({...shippingData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cpf" className="text-xs">CPF</Label>
                <Input 
                  id="cpf" 
                  placeholder="000.000.000-00" 
                  value={shippingData.cpf}
                  onChange={(e) => setShippingData({...shippingData, cpf: formatCPF(e.target.value)})}
                />
              </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cep" className="text-xs">CEP</Label>
                <Input 
                  id="cep" 
                  placeholder="00000-000" 
                  value={shippingData.cep}
                  onChange={(e) => setShippingData({...shippingData, cep: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="celular_entrega" className="text-xs">Celular (WhatsApp)</Label>
                <Input 
                  id="celular_entrega" 
                  placeholder="(00) 00000-0000" 
                  value={shippingData.celular}
                  onChange={(e) => setShippingData({...shippingData, celular: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

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
            {calculatedOptions.length > 0 ? (
              calculatedOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${shippingMethod === option.id ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="text-[#800020]" />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                    <div className="font-bold flex justify-between">
                      <span>{option.label}</span>
                      <span className="text-[#800020]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{option.days}</div>
                  </Label>
                </div>
              ))
            ) : isCalculating ? (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-[#800020] mr-2" />
                <span className="text-sm text-muted-foreground">Calculando frete...</span>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                Insira o CEP para ver as opções de frete
              </div>
            )}
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${shippingMethod === 'onibus' ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
              <RadioGroupItem value="onibus" id="onibus" className="text-[#800020]" />
              <Label htmlFor="onibus" className="flex-grow cursor-pointer">
                <div className="font-bold flex justify-between">
                  <span>Ônibus ou Transportadora</span>
                  <span className="text-xs font-normal text-muted-foreground">A combinar</span>
                </div>
                <div className="text-xs text-muted-foreground">Ideal para compras no atacado</div>
              </Label>
              <Bus className="h-5 w-5 text-gray-400" />
            </div>
          </RadioGroup>
        </div>

        {shippingMethod !== 'onibus' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Endereço de Entrega</h3>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="endereco" className="text-xs">Endereço</Label>
                <Input 
                  id="endereco" 
                  placeholder="Rua, Avenida, etc." 
                  value={shippingData.endereco}
                  onChange={(e) => setShippingData({...shippingData, endereco: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="numero" className="text-xs">Número</Label>
                  <Input 
                    id="numero" 
                    placeholder="123" 
                    value={shippingData.numero}
                    onChange={(e) => setShippingData({...shippingData, numero: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="bairro" className="text-xs">Bairro</Label>
                  <Input 
                    id="bairro" 
                    placeholder="Bairro" 
                    value={shippingData.bairro}
                    onChange={(e) => setShippingData({...shippingData, bairro: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cidade_entrega" className="text-xs">Cidade</Label>
                  <Input 
                    id="cidade_entrega" 
                    placeholder="Cidade" 
                    value={shippingData.cidade}
                    onChange={(e) => setShippingData({...shippingData, cidade: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="estado_entrega" className="text-xs">Estado</Label>
                  <Input 
                    id="estado_entrega" 
                    placeholder="UF" 
                    value={shippingData.estado}
                    onChange={(e) => setShippingData({...shippingData, estado: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {shippingMethod === 'onibus' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Dados para Envio por Ônibus</h3>
            <div className="grid gap-3">
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

            <SheetFooter className="p-4 border-t bg-[#f9f9f9] flex-col gap-4">
              <div className="space-y-1.5 w-full">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#71717a]">Subtotal</span>
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          // Removed confirm() as it fails in iframes
                          clearCart();
                        }}
                        className="text-[10px] text-[#800020] hover:underline flex items-center gap-1 font-bold uppercase"
                      >
                      <Trash2 size={10} />
                      Limpar Carrinho
                    </button>
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                    </span>
                  </div>
                </div>
              
                {isCheckout && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#71717a]">Frete</span>
                      <span className="text-[#121812] font-medium">
                        {!isShippingSelected ? (
                          <span className="text-[#800020] text-[10px] font-bold italic animate-pulse">SELECIONE O FRETE</span>
                        ) : shippingMethod === 'onibus' ? (
                          'A combinar'
                        ) : (
                          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingPrice)
                        )}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base font-bold text-[#121812]">
                      <span>Total</span>
                      <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice + shippingPrice)}
                      </span>
                    </div>
                  </>
                )}

              {!isCheckout && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-bold text-[#121812]">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#800020] text-center mt-2 font-bold uppercase">
                    *Frete calculado na finalização do pedido
                  </p>
                  <p className="text-[10px] text-[#800020] text-center mt-1 font-bold uppercase">
                    *Compra mínima de R$ 350,00
                  </p>
                </>
              )}
            </div>

                <div className="w-full space-y-2">
                  {totalPrice < 350 && !isCheckout && (
                    <p className="text-xs text-[#800020] text-center font-medium animate-pulse">
                      Faltam {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(350 - totalPrice)} para o pedido mínimo
                    </p>
                  )}
                    <Button 
                      className="w-full bg-[#121812] hover:bg-[#800020] text-white py-6 text-base font-bold uppercase tracking-wider"
                      disabled={isSubmitting || (totalPrice < 350) || (isCheckout && !canFinishCheckout)}
                      onClick={() => {
                        if (isCheckout) {
                          handleFinish();
                        } else {
                          setIsCheckout(true);
                        }
                      }}
                    >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      isCheckout ? 'Confirmar Pedido' : 'Finalizar Compra'
                    )}
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
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
}

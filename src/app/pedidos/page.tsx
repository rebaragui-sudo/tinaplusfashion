'use client';

import React, { useEffect, useState } from 'react';
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Package, Calendar, MapPin, Truck, Bus, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getColorName } from '@/lib/colors';

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  shipping_method: string;
  items: any[];
  shipping_data: any;
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const storedOrderIds = JSON.parse(localStorage.getItem('tina-plus-orders') || '[]');
        
        if (storedOrderIds.length === 0) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .in('id', storedOrderIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'processing': return { label: 'Processando', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'shipped': return { label: 'Enviado', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'delivered': return { label: 'Entregue', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'cancelled': return { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200' };
      default: return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfaf8]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#121812]">Meus Pedidos</h1>
              <p className="text-[#71717a] mt-1">Acompanhe o status das suas compras</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-[#121812] text-[#121812] hover:bg-[#121812] hover:text-white">
                Continuar Comprando
              </Button>
            </Link>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
              <p className="mt-4 text-[#71717a]">Carregando seus pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="border-dashed border-2 bg-white/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#f5f3f1] rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-[#71717a]" />
                </div>
                <h2 className="text-xl font-bold text-[#121812]">Nenhum pedido encontrado</h2>
                <p className="text-[#71717a] mt-2 mb-6 max-w-sm">
                  Você ainda não realizou nenhuma compra ou seus pedidos foram limpos do histórico do navegador.
                </p>
                <Link href="/produtos">
                  <Button className="bg-[#121812] hover:bg-[#800020] text-white">
                    Ver Produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <Card key={order.id} className="overflow-hidden border-[#e4e4e7] hover:shadow-md transition-shadow">
                    <CardHeader className="bg-white border-b border-[#f1f1f4] px-6 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#121812] text-white p-2 rounded-lg">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#71717a] font-bold">Pedido</p>
                            <p className="text-sm font-mono font-medium">#{order.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden sm:block">
                            <p className="text-[10px] uppercase tracking-wider text-[#71717a] font-bold">Data</p>
                            <div className="flex items-center gap-1.5 text-sm text-[#121812]">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#71717a] font-bold">Total</p>
                            <p className="text-sm font-bold text-[#800020]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                            </p>
                          </div>
                          <Badge className={`${status.color} border font-medium px-2.5 py-0.5 rounded-full`}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xs font-bold uppercase text-[#121812] mb-4 flex items-center gap-2">
                            Itens do Pedido
                          </h3>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-4">
                                <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded border border-[#e4e4e7]">
                                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <p className="text-sm font-medium text-[#121812] line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-[#71717a]">
                                    {item.quantity}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                    {item.size && ` | Tam: ${item.size}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-[#fcfaf8] rounded-xl p-4 border border-[#f1f1f4]">
                          <h3 className="text-xs font-bold uppercase text-[#121812] mb-4 flex items-center gap-2">
                            Informações de Entrega
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 bg-white p-1.5 rounded-md border border-[#e4e4e7]">
                                {order.shipping_method === 'onibus' ? <Bus className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#121812]">Forma de Envio</p>
                                <p className="text-sm text-[#71717a]">
                                  {order.shipping_method === 'onibus' ? 'Ônibus ou Transportadora' : 'Correios (PAC/SEDEX)'}
                                </p>
                              </div>
                            </div>
                            {order.shipping_data?.nome && (
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 bg-white p-1.5 rounded-md border border-[#e4e4e7]">
                                  <MapPin className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#121812]">Destinatário</p>
                                  <p className="text-sm text-[#71717a]">{order.shipping_data.nome}</p>
                                  <p className="text-sm text-[#71717a]">
                                    {order.shipping_data.cidade} - {order.shipping_data.estado}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <Separator className="my-4" />
                          <div className="flex items-center justify-between">
                            <Link href="https://wa.me/5511999999999" target="_blank" className="w-full">
                              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 font-bold">
                                Suporte via WhatsApp
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

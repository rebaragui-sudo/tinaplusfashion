'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Loader2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getColorName, getColorValue } from '@/lib/colors';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image_url: string;
}

interface ShippingData {
  nome: string;
  cpf?: string;
  estado: string;
  cidade: string;
  celular: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
}

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  shipping_price: number;
  status: string;
  shipping_method: string;
  items: OrderItem[];
  shipping_data: ShippingData;
}

export default function AdminOrdersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pagos'>('todos');

  const filteredOrders = filter === 'pagos'
    ? orders.filter(o => o.status !== 'pending')
    : orders;

  useEffect(() => {
    const auth = localStorage.getItem('isAdmin');
    if (auth === 'true') {
      setIsAdmin(true);
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tina2025') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      fetchOrders();
    } else {
      toast.error('Senha incorreta!');
    }
  };

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Pedidos - Acesso Restrito</h1>
          <p className="text-gray-500 text-center mb-8">Digite a senha administrativa para ver os pedidos.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none transition-all text-center text-lg"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#800020] text-white rounded-xl font-bold hover:bg-[#600018] transition-all shadow-lg shadow-[#800020]/20"
            >
              Acessar Pedidos
            </button>
            <Link 
              href="/"
              className="block text-center text-sm text-gray-500 hover:text-[#800020] transition-colors"
            >
              Voltar para o site
            </Link>
          </form>
        </div>
      </div>
    );
  }

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success('Status do pedido atualizado!');
    } catch (error: any) {
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'processando': return 'bg-blue-100 text-blue-800';
      case 'enviado': return 'bg-purple-100 text-purple-800';
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return <Clock size={14} />;
      case 'processando': return <Loader2 size={14} className="animate-spin" />;
      case 'enviado': return <Truck size={14} />;
      case 'entregue': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-[#800020] hover:underline text-sm font-medium mb-2 group"
            >
              <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Voltar ao Gerenciamento
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
            <p className="text-gray-600">Acompanhe e gerencie as vendas da sua loja</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Total de Pedidos</p>
                <p className="text-xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pedidos Recentes</h2>
                <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-bold">
                  <button
                    onClick={() => setFilter('todos')}
                    className={`px-3 py-1.5 transition-colors ${filter === 'todos' ? 'bg-[#800020] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    Todos ({orders.length})
                  </button>
                  <button
                    onClick={() => setFilter('pagos')}
                    className={`px-3 py-1.5 transition-colors border-l border-gray-200 ${filter === 'pagos' ? 'bg-[#800020] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    Pagos ({orders.filter(o => o.status !== 'pending').length})
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b">
                    <tr>
                      <th className="px-6 py-3">Pedido</th>
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Data</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <Loader2 className="animate-spin mx-auto text-[#800020] mb-2" />
                          <p className="text-sm text-gray-500">Carregando pedidos...</p>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <ShoppingBag size={48} className="mx-auto text-gray-200 mb-2" />
                          <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gray-50' : ''}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono font-bold text-gray-400">#{order.id.slice(0, 8)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{order.shipping_data?.nome || 'N/A'}</span>
                              <span className="text-[10px] text-gray-500">{order.shipping_method}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#800020]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-[#800020] transition-colors">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8 overflow-hidden">
                <div className="p-4 border-b bg-[#800020] text-white flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2">
                    <Package size={18} />
                    Detalhes do Pedido
                  </h3>
                  <span className="text-[10px] font-mono opacity-80">#{selectedOrder.id.slice(0, 8)}</span>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Status Change */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alterar Status</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#800020] outline-none font-medium"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Processando">Processando</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                        <User size={18} />
                      </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-medium">Cliente</span>
                          <span className="text-sm font-bold text-gray-900">{selectedOrder.shipping_data?.nome}</span>
                          {selectedOrder.shipping_data?.cpf && (
                            <span className="text-[10px] text-gray-500 font-mono">CPF: {selectedOrder.shipping_data?.cpf}</span>
                          )}
                        </div>

                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                        <Phone size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">WhatsApp / Celular</span>
                        <a 
                          href={`https://wa.me/${selectedOrder.shipping_data?.celular.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-[#800020] hover:underline flex items-center gap-1"
                        >
                          {selectedOrder.shipping_data?.celular}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                        <MapPin size={18} />
                      </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-medium">Destino</span>
                          <span className="text-sm font-bold text-gray-900">
                            {selectedOrder.shipping_data?.endereco}, {selectedOrder.shipping_data?.numero}
                          </span>
                          <span className="text-xs text-gray-600">
                            {selectedOrder.shipping_data?.bairro} - {selectedOrder.shipping_data?.cidade}, {selectedOrder.shipping_data?.estado}
                          </span>
                          <span className="text-xs font-mono text-gray-500 mt-0.5">
                            CEP: {selectedOrder.shipping_data?.cep}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium mt-2 uppercase bg-gray-100 px-1.5 py-0.5 rounded inline-block w-fit">
                            {selectedOrder.shipping_method}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 pt-4 border-t">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Produtos</label>
                      <div className="space-y-3">
                        {selectedOrder.items
                          .filter((item: any) => !item.cartId?.includes('no-size-no-color'))
                          .map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden border flex-shrink-0">
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                              {item.isCombo && item.subItems && item.subItems.length > 0 ? (
                                <div className="mt-1 space-y-1">
                                  {item.subItems.map((sub: any, subIdx: number) => (
                                    <div key={subIdx} className="flex items-center gap-2">
                                      {sub.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">{sub.size}</span>}
                                      {sub.color && (
                                        <>
                                          <div className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: getColorValue(sub.color) }} />
                                          <span className="text-[10px] font-bold text-gray-500 uppercase">{getColorName(sub.color)}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (item.size || item.color) ? (
                                <div className="flex items-center gap-2 mt-1">
                                  {item.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">{item.size}</span>}
                                  {item.color && (
                                    <>
                                      <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: getColorValue(item.color) }} />
                                      <span className="text-[10px] font-bold text-gray-500 uppercase">{getColorName(item.color)}</span>
                                    </>
                                  )}
                                </div>
                              ) : null}
                              <p className="text-[10px] text-gray-500 mt-1 font-medium">{item.quantity}x • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total_price - (selectedOrder.shipping_price || 0))}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Frete</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.shipping_price || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 mt-2">
                        <span className="text-sm font-bold text-gray-600">Total do Pedido</span>
                        <span className="text-lg font-black text-[#800020]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total_price)}
                        </span>
                      </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <Eye size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Selecione um pedido</h3>
                <p className="text-sm text-gray-500">Clique em um pedido na lista ao lado para ver todos os detalhes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

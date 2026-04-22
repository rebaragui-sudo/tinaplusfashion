'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  Heart,
  User,
  LogOut,
  ShoppingBag,
  Truck,
  MapPin,
  ExternalLink,
  Loader2,
  ChevronRight,
  Pencil,
  X,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getColorName, getColorValue } from '@/lib/colors';

export default function MyAccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    cpf: '',
    address_cep: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
  });
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, authLoading]);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);
      setEditForm({
        full_name: profileData?.full_name || '',
        phone: profileData?.phone || '',
        cpf: profileData?.cpf || '',
        address_cep: profileData?.address?.zipcode || '',
        address_street: profileData?.address?.street || '',
        address_number: profileData?.address?.number || '',
        address_complement: profileData?.address?.complement || '',
        address_neighborhood: profileData?.address?.neighborhood || '',
        address_city: profileData?.address?.city || '',
        address_state: profileData?.address?.state || '',
      });

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setOrders(ordersData || []);

      // Fetch wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user?.id);
      
      setWishlist(wishlistData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const address = {
        zipcode: editForm.address_cep,
        street: editForm.address_street,
        number: editForm.address_number,
        complement: editForm.address_complement,
        neighborhood: editForm.address_neighborhood,
        city: editForm.address_city,
        state: editForm.address_state,
      };
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user?.id, full_name: editForm.full_name, phone: editForm.phone, cpf: editForm.cpf, address });
      if (error) throw error;
      setProfile((prev: any) => ({ ...prev, full_name: editForm.full_name, phone: editForm.phone, cpf: editForm.cpf, address }));
      setIsEditing(false);
      toast.success('Dados atualizados com sucesso!');
    } catch (e) {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#b8860b]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfaf8]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#121812]">Minha Conta</h1>
            <p className="text-gray-600">Olá, {profile?.full_name || user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border h-14">
            <TabsTrigger value="pedidos" className="data-[state=active]:bg-[#121812] data-[state=active]:text-white">
              <Package className="mr-2 h-4 w-4 hidden sm:block" />
              Meus Pedidos
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="data-[state=active]:bg-[#121812] data-[state=active]:text-white">
              <Heart className="mr-2 h-4 w-4 hidden sm:block" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="perfil" className="data-[state=active]:bg-[#121812] data-[state=active]:text-white">
              <User className="mr-2 h-4 w-4 hidden sm:block" />
              Meus Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pedidos" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="text-center py-12 border-dashed">
                <CardContent className="space-y-4">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="space-y-2">
                    <CardTitle>Nenhum pedido encontrado</CardTitle>
                    <CardDescription>Você ainda não realizou compras em nossa loja.</CardDescription>
                  </div>
                  <Button asChild className="bg-[#121812] text-white">
                    <Link href="/">Ir para a loja</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => {
                  const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1), 0) || 0;
                  const frete = order.shipping_price || 0;
                  const total = order.total_price || subtotal + frete;
                  return (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      {/* Cabeçalho do pedido */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <Badge variant={order.status === 'pago' || order.status === 'completed' ? 'default' : 'outline'}
                          className={`self-start capitalize ${order.status === 'pago' || order.status === 'completed' ? 'bg-green-600' : ''}`}>
                          {order.status === 'processing' ? 'Em processamento' :
                           order.status === 'completed' ? 'Entregue' :
                           order.status === 'shipped' ? 'Enviado' :
                           order.status === 'pago' ? 'Pago' :
                           order.status === 'pending' ? 'Aguardando pagamento' : order.status}
                        </Badge>
                      </div>

                      {/* Lista de produtos */}
                      <div className="border-t pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Produtos</p>
                        <div className="space-y-4">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3">
                              <div className="h-16 w-16 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                                {item.image_url
                                  ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                  : <Package className="h-full w-full p-3 text-gray-400" />}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {item.size && (
                                    <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">{item.size}</span>
                                  )}
                                  {item.color && (
                                    <span className="flex items-center gap-1">
                                      <span className="w-3 h-3 rounded-full border border-gray-200 inline-block" style={{ backgroundColor: getColorValue(item.color) }} />
                                      <span className="text-xs font-bold text-gray-600 uppercase">{getColorName(item.color)}</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.quantity}x • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || 0)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totais */}
                      <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Subtotal</span>
                          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                        </div>
                        {frete > 0 && (
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Frete</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(frete)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t pt-2">
                          <span>Total do Pedido</span>
                          <span className="text-[#b8860b]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                        </div>
                      </div>

                      {/* Rastreio */}
                      {order.tracking_number && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-blue-100">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                            <div>
                              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Código de Rastreio</p>
                              <p className="text-sm font-mono font-bold text-gray-700">{order.tracking_number}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50 shrink-0">
                            <a href={`https://www.linkcorreios.com.br/${order.tracking_number}`} target="_blank" rel="noopener noreferrer">
                              Rastrear <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                )})}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favoritos">
            {wishlist.length === 0 ? (
              <Card className="text-center py-12 border-dashed">
                <CardContent className="space-y-4">
                  <Heart className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="space-y-2">
                    <CardTitle>Sua lista está vazia</CardTitle>
                    <CardDescription>Salve seus produtos favoritos para ver aqui depois.</CardDescription>
                  </div>
                  <Button asChild className="bg-[#121812] text-white">
                    <Link href="/">Ver produtos</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist.map((item) => (
                  <Card key={item.product_id} className="overflow-hidden group">
                    <Link href={`/produto/${item.product_id}`}>
                      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-1">{item.products.name}</h3>
                        <p className="text-[#b8860b] font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.products.price)}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Meus Dados Pessoais</CardTitle>
                    <CardDescription>Gerencie suas informações de contato.</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditForm({ full_name: profile?.full_name || '', phone: profile?.phone || '', cpf: profile?.cpf || '', address_cep: profile?.address?.zipcode || '', address_street: profile?.address?.street || '', address_number: profile?.address?.number || '', address_complement: profile?.address?.complement || '', address_neighborhood: profile?.address?.neighborhood || '', address_city: profile?.address?.city || '', address_state: profile?.address?.state || '' }); }} className="gap-2">
                        <X className="h-4 w-4" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="bg-[#121812] text-white gap-2">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase font-bold">Nome Completo</Label>
                      <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase font-bold">E-mail</Label>
                      <Input value={user?.email || ''} disabled className="bg-gray-50 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase font-bold">Telefone</Label>
                      <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 uppercase font-bold">CPF</Label>
                      <Input value={editForm.cpf} onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })} placeholder="000.000.000-00" />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Endereço de Entrega</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">CEP</Label>
                        <Input value={editForm.address_cep} onChange={(e) => setEditForm({ ...editForm, address_cep: e.target.value })} placeholder="00000-000" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Rua / Endereço</Label>
                        <Input value={editForm.address_street} onChange={(e) => setEditForm({ ...editForm, address_street: e.target.value })} placeholder="Rua, Avenida..." />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Número</Label>
                        <Input value={editForm.address_number} onChange={(e) => setEditForm({ ...editForm, address_number: e.target.value })} placeholder="123" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Complemento</Label>
                        <Input value={editForm.address_complement} onChange={(e) => setEditForm({ ...editForm, address_complement: e.target.value })} placeholder="Apto, Bloco..." />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Bairro</Label>
                        <Input value={editForm.address_neighborhood} onChange={(e) => setEditForm({ ...editForm, address_neighborhood: e.target.value })} placeholder="Bairro" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Cidade</Label>
                        <Input value={editForm.address_city} onChange={(e) => setEditForm({ ...editForm, address_city: e.target.value })} placeholder="Cidade" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase font-bold">Estado (UF)</Label>
                        <Input value={editForm.address_state} onChange={(e) => setEditForm({ ...editForm, address_state: e.target.value })} placeholder="SP" maxLength={2} />
                      </div>
                    </div>
                  </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">Nome Completo</p>
                      <p className="text-sm font-medium">{profile?.full_name || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">E-mail</p>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                      <p className="text-sm font-medium">{profile?.phone || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">CPF</p>
                      <p className="text-sm font-medium">{profile?.cpf || 'Não informado'}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Endereço de Entrega</h4>
                  </div>
                  {profile?.address ? (
                    <div className="text-sm space-y-1 text-gray-600">
                      <p>{profile.address.street}, {profile.address.number}</p>
                      {profile.address.complement && <p>{profile.address.complement}</p>}
                      <p>{profile.address.neighborhood}</p>
                      <p>{profile.address.city} - {profile.address.state}</p>
                      <p>CEP: {profile.address.zipcode}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhum endereço cadastrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

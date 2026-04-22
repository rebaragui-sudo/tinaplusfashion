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
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function MyAccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
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
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Pedido #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={
                            order.status === 'pago' || order.status === 'completed' ? 'default' :
                            order.status === 'processing' ? 'secondary' :
                            'outline'
                          } className={`capitalize ${order.status === 'pago' || order.status === 'completed' ? 'bg-green-600' : ''}`}>
                            {order.status === 'processing' ? 'Em processamento' :
                             order.status === 'completed' ? 'Entregue' :
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'pago' ? 'Pago' :
                             order.status === 'pending' ? 'Aguardando pagamento' : order.status}
                          </Badge>
                          <p className="font-bold text-[#b8860b]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Itens do Pedido</h4>
                        <div className="space-y-3">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded bg-gray-100 flex-shrink-0">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded" />
                                ) : (
                                  <Package className="h-full w-full p-2 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  Qtd: {item.quantity}
                                  {item.size ? ` | Tam: ${item.size}` : ''}
                                  {item.color ? ` | Cor: ${item.color}` : ''}
                                </p>
                                {item.price > 0 && (
                                  <p className="text-xs font-semibold text-[#b8860b] mt-0.5">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} / peça
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.tracking_number && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Código de Rastreio</p>
                              <p className="text-sm font-mono font-bold text-gray-700">{order.tracking_number}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            <a href={`https://www.linkcorreios.com.br/${order.tracking_number}`} target="_blank" rel="noopener noreferrer">
                              Rastrear Pedido
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
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
                <CardTitle>Meus Dados Pessoais</CardTitle>
                <CardDescription>Gerencie suas informações de contato e endereço.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

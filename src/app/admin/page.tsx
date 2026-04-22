'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
    Plus, 
    Trash2, 
    Edit, 
    Package, 
    DollarSign, 
    Image as ImageIcon, 
    Loader2,
      ShoppingBag,
      Save,
      X,
      ExternalLink,
      ChevronLeft,
      Pipette,
      Palette,
      Upload,
      TrendingUp,
      Clock,
      Users
    } from 'lucide-react';


import { toast } from 'sonner';
import Link from 'next/link';
import { getColorName, getColorValue, getEstampaImage } from '@/lib/colors';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  category: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  colors: string[];
  sizes: string[];
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [colorInput, setColorInput] = useState('#000000');
  const [colorNameInput, setColorNameInput] = useState('');
  const [colorMode, setColorMode] = useState<'cor' | 'estampa'>('cor');
  const [estampaImageUrl, setEstampaImageUrl] = useState('');
  const [uploadingEstampa, setUploadingEstampa] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    images: [] as string[],
    is_featured: false,
    is_new_arrival: false,
    colors: [] as string[],
    sizes: ['G1', 'G2', 'G3'],
  });
  const [variantStock, setVariantStock] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0
  });

  const availableSizes = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'G4', 'G5'];

  useEffect(() => {
    const auth = localStorage.getItem('isAdmin');
    if (auth === 'true') {
      setIsAdmin(true);
      fetchProducts();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchStats() {
    try {
      const { data: orders } = await supabase.from('orders').select('total_amount, status');
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      if (orders) {
        const total = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
        setStats({
          totalOrders: orders.length,
          totalRevenue: total,
          activeProducts: productCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tina2025') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      fetchProducts();
    } else {
      toast.error('Senha incorreta!');
    }
  };

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Acesso Restrito</h1>
          <p className="text-gray-500 text-center mb-8">Digite a senha para acessar o painel administrativo.</p>
          
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
              Entrar no Painel
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

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const openEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      toast.error('Seu navegador não suporta o conta-gotas');
      return;
    }

    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      setColorInput(result.sRGBHex);
    } catch (e) {
      // User cancelled
    }
  };

  const addColor = () => {
    if (!colorNameInput.trim()) {
      toast.error('Por favor, dê um nome para a ' + (colorMode === 'estampa' ? 'estampa' : 'cor'));
      return;
    }
    const colorEntry = colorMode === 'estampa'
      ? `${colorNameInput.trim()}:estampa${estampaImageUrl ? ':' + estampaImageUrl : ''}`
      : `${colorNameInput.trim()}:${colorInput}`;
    if (formData.colors.includes(colorEntry)) {
      toast.error('Já adicionado');
      return;
    }
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, colorEntry]
    }));
    setColorNameInput('');
    setEstampaImageUrl('');
  };

  const uploadEstampaImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEstampa(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `product-images/estampa-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setEstampaImageUrl(data.publicUrl);
      toast.success('Imagem da estampa carregada!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploadingEstampa(false);
      e.target.value = '';
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isGallery = false) {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        newUrls.push(data.publicUrl);
      }

      if (isGallery) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
        toast.success(`${newUrls.length} imagem(ns) adicionada(s) à galeria!`);
      } else {
        setFormData(prev => ({ ...prev, image_url: newUrls[0] }));
        toast.success('Imagem principal atualizada!');
      }
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      let productId: string;
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', isEditing);
        if (error) throw error;
        productId = isEditing;
        toast.success('Produto atualizado!');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
        toast.success('Produto criado!');
      }

      // Update Variants Stock
      // 1. Delete old variants
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      // 2. Insert current variants
      const variantsToInsert = [];
      for (const color of formData.colors) {
        for (const size of formData.sizes) {
          const stock = parseInt(variantStock[`${color}|${size}`] || '0');
          variantsToInsert.push({
            product_id: productId,
            color,
            size,
            stock
          });
        }
      }

      if (variantsToInsert.length > 0) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);
        if (variantError) throw variantError;
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        images: [],
        is_featured: false,
        is_new_arrival: false,
        colors: [],
        sizes: ['G1', 'G2', 'G3'],
      });
      setVariantStock({});
      setIsEditing(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Produto excluído!');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  }

  async function handleEdit(product: Product) {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      image_url: product.image_url || '',
      images: product.images || [],
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      colors: product.colors || [],
      sizes: product.sizes || ['G1', 'G2', 'G3'],
    });

    // Fetch variants stock
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id);

    if (variants) {
      const stock: Record<string, string> = {};
      variants.forEach(v => {
        stock[`${v.color}|${v.size}`] = v.stock.toString();
      });
      setVariantStock(stock);
    } else {
      setVariantStock({});
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
              <div className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="flex items-center gap-1 text-[#800020] hover:underline text-sm font-medium mb-2 group"
                >
                  <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  Voltar para o Site
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
                <p className="text-gray-600">Gerencie seus produtos e preços</p>
              </div>
              <div className="flex items-center gap-4">
<Link 
                    href="/admin/exportar"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-sm"
                  >
                    <ExternalLink size={18} />
                    Exportar p/ Shopee
                  </Link>
                  <Link 
                    href="/admin/pedidos"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-[#800020] hover:text-[#800020] transition-all shadow-sm"
                  >
                    <ShoppingBag size={18} />
                    Ver Pedidos
                  </Link>
                <div className="bg-[#800020] text-white p-3 rounded-full shadow-lg">
                  <Package size={24} />
                </div>
              </div>

            </header>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total de Pedidos</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Receita Total</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue)}
                </h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Produtos Ativos</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeProducts}</h3>
              </div>
            </div>
          </section>

          {/* Form Section */}

        <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                <input
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Conjunto Alfaiataria"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preço (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <input
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Conjuntos, Vestidos"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cores do Produto</label>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                      <button
                        type="button"
                        onClick={() => setColorMode('cor')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${colorMode === 'cor' ? 'bg-white shadow text-[#800020]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Cor
                      </button>
                      <button
                        type="button"
                        onClick={() => setColorMode('estampa')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${colorMode === 'estampa' ? 'bg-white shadow text-[#800020]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Estampa
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none text-sm"
                        value={colorNameInput}
                        onChange={(e) => setColorNameInput(e.target.value)}
                        placeholder={colorMode === 'estampa' ? 'Nome da estampa (ex: Floral, Xadrez)' : 'Nome da cor (ex: Azul Marinho)'}
                      />
                      {colorMode === 'cor' && (
                        <div className="flex items-center gap-1 border rounded-md p-1 bg-white">
                          <input
                            type="color"
                            className="w-8 h-8 p-0 border-0 cursor-pointer rounded overflow-hidden"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={openEyeDropper}
                            title="Usar conta-gotas"
                            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
                          >
                            <Pipette size={18} />
                          </button>
                        </div>
                      )}
                      {colorMode === 'estampa' && (
                        <label className="cursor-pointer flex items-center gap-1 border rounded-md p-1 bg-white hover:bg-gray-50 transition-colors" title="Upload da estampa">
                          {uploadingEstampa ? (
                            <Loader2 size={18} className="animate-spin text-gray-400" />
                          ) : estampaImageUrl ? (
                            <img src={estampaImageUrl} className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <ImageIcon size={18} className="text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500 pr-1">{estampaImageUrl ? 'Trocar' : 'Foto'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={uploadEstampaImage} />
                        </label>
                      )}
                      <button
                        type="button"
                        onClick={addColor}
                        className="px-4 bg-[#800020] text-white rounded-md hover:bg-[#600018] transition-colors flex items-center gap-1 text-sm font-bold"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                  
                  {formData.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-dashed">
                      {formData.colors.map((color, idx) => (
                        <div key={idx} className="group relative flex items-center gap-2 bg-white px-2 py-1 rounded-full border shadow-sm">
                          {getColorValue(color) === 'estampa' ? (
                            getEstampaImage(color) ? (
                              <img src={getEstampaImage(color)!} className="w-5 h-5 rounded-full border shadow-sm object-cover" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border shadow-sm bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300 flex items-center justify-center text-[8px]">🎨</div>
                            )
                          ) : (
                            <div
                              className="w-4 h-4 rounded-full border shadow-sm"
                              style={{ backgroundColor: getColorValue(color) }}
                            />
                          )}
                          <span className="text-xs font-medium text-gray-700">{getColorName(color)}</span>
                          {getColorValue(color) === 'estampa' && (
                            <span className="text-[9px] text-gray-400 italic">estampa</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="p-0.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do produto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Imagem Principal</label>
                <div className="relative aspect-[3/4] max-w-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                  {formData.image_url ? (
                    <>
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label htmlFor="main-upload" className="cursor-pointer p-2 bg-white rounded-full text-[#800020]">
                          <Upload size={20} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label htmlFor="main-upload" className="cursor-pointer flex flex-col items-center p-4 text-center">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <span className="text-xs text-gray-500 font-medium">Clique para enviar</span>
                    </label>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#800020]" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                    id="main-upload"
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Outras Fotos (Galeria)</label>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label 
                    htmlFor="gallery-upload"
                    className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="text-gray-400" size={20} />
                    <span className="text-[10px] text-gray-500 mt-1">Adicionar</span>
                  </label>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                  id="gallery-upload"
                />
              </div>
            </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tamanhos Disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#800020]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  </div>
                </div>

                {formData.colors.length > 0 && formData.sizes.length > 0 && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="text-sm font-bold text-[#800020] uppercase tracking-wider flex items-center gap-2">
                      <Package size={16} />
                      Estoque por Cor e Tamanho
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {formData.colors.map(color => (
                        formData.sizes.map(size => (
                          <div key={`${color}-${size}`} className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                            {getColorValue(color) === 'estampa' ? (
                              getEstampaImage(color) ? (
                                <img src={getEstampaImage(color)!} className="w-6 h-6 rounded-full border shrink-0 object-cover" title={getColorName(color)} />
                              ) : (
                                <div className="w-6 h-6 rounded-full border shrink-0 bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300 flex items-center justify-center text-[10px]">🎨</div>
                              )
                            ) : (
                              <div
                                className="w-6 h-6 rounded-full border shrink-0"
                                style={{ backgroundColor: getColorValue(color) }}
                                title={getColorName(color)}
                              />
                            )}
                            <div className="flex-grow">
                              <span className="text-[10px] font-bold text-gray-400 block uppercase leading-none mb-1">
                                {getColorName(color)} - {size}
                              </span>
                              <input
                                type="number"
                                min="0"
                                className="w-full p-1 text-sm border rounded focus:ring-1 focus:ring-[#800020] outline-none"
                                placeholder="Qtd"
                                value={variantStock[`${color}|${size}`] || ''}
                                onChange={(e) => setVariantStock(prev => ({
                                  ...prev,
                                  [`${color}|${size}`]: e.target.value
                                }))}
                              />
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm font-medium group-hover:text-[#800020]">Em Destaque</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_new_arrival}
                  onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                  className="w-4 h-4 rounded text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm font-medium group-hover:text-[#800020]">Novidade</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      image_url: '',
                      images: [],
                      is_featured: false,
                      is_new_arrival: false,
                      colors: [],
                      sizes: ['G1', 'G2', 'G3'],
                    });
                  }}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <X size={18} />
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-2 bg-[#800020] text-white rounded-md hover:bg-[#600018] transition-colors disabled:opacity-50 flex items-center gap-2 font-bold shadow-md shadow-[#800020]/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Save size={18} /> : <Plus size={18} />)}
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </section>

        {/* Product List */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Seus Produtos</h2>
            <span className="text-sm text-gray-500 font-medium">{products.length} itens</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Produto</th>
                    <th className="px-6 py-4 font-semibold text-center">Cores</th>
                    <th className="px-6 py-4 font-semibold">Categoria</th>
                    <th className="px-6 py-4 font-semibold">Preço</th>
                    <th className="px-6 py-4 font-semibold sticky right-0 bg-gray-50 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Package size={48} className="text-gray-200" />
                          <p className="font-medium">{loading ? 'Carregando produtos...' : 'Nenhum produto cadastrado.'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-16 rounded overflow-hidden border bg-gray-50">
                              <img
                                src={product.image_url || 'https://via.placeholder.com/40'}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 leading-tight">{product.name}</span>
                            </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-wrap gap-1 justify-center min-w-[60px]">
                              {(product.colors || []).map((color, idx) => (
                                getColorValue(color) === 'estampa' ? (
                                  getEstampaImage(color) ? (
                                    <img key={idx} src={getEstampaImage(color)!} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm object-cover" title={getColorName(color)} />
                                  ) : (
                                    <div key={idx} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300" title={getColorName(color)} />
                                  )
                                ) : (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: getColorValue(color) }}
                                    title={getColorName(color)}
                                  />
                                )
                              ))}
                              {(!product.colors || product.colors.length === 0) && (
                                <span className="text-[10px] text-gray-400">n/a</span>
                              )}
                            </div>
                          </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-[#800020]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right sticky right-0 bg-white">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl scale-in-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Excluir Produto?</h3>
              <p className="text-gray-500 text-center mb-8">Esta ação removerá o produto permanentemente. Tem certeza?</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Confirmar Exclusão
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

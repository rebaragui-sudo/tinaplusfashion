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
  Save,
  X,
  ExternalLink,
  ChevronLeft,
  Pipette,
  Palette,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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
  color?: string;
  sizes: string[];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const availableSizes = ['44', '46', '48', '50', '52', 'G1', 'G2', 'G3'];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    images: [] as string[],
    is_featured: false,
    is_new_arrival: false,
    color: '#000000',
    sizes: ['G1', 'G2', 'G3'] as string[],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setFormData({ ...formData, color: result.sRGBHex });
    } catch (e) {
      // User cancelled
    }
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
        toast.success('Produto atualizado!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        toast.success('Produto criado!');
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
        color: '#000000',
      });
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

  function handleEdit(product: Product) {
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
      color: product.color || '#000000',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
            <div className="bg-[#800020] text-white p-3 rounded-full shadow-lg">
              <Package size={24} />
            </div>
          </header>

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
                <label className="text-sm font-medium text-gray-700">Cor do Produto</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow flex items-center">
                    <input
                      type="text"
                      className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none font-mono text-sm"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#000000"
                    />
                    <div 
                      className="absolute left-2 w-6 h-6 rounded border shadow-sm"
                      style={{ backgroundColor: formData.color }}
                    />
                  </div>
                  <input
                    type="color"
                    className="w-12 h-10 p-1 border rounded-md cursor-pointer"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={openEyeDropper}
                    title="Usar conta-gotas"
                    className="p-2 border rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <Pipette size={20} />
                  </button>
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
                      color: '#000000',
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
                    <th className="px-6 py-4 font-semibold text-center">Fotos</th>
                    <th className="px-6 py-4 font-semibold">Categoria</th>
                    <th className="px-6 py-4 font-semibold">Preço</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                              <div className="flex items-center gap-1.5 mt-1">
                                <div 
                                  className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: product.color || '#fff' }}
                                />
                                <span className="text-[10px] font-mono text-gray-400 uppercase">{product.color || 'n/a'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                            <ImageIcon size={12} />
                            {1 + (product.images?.length || 0)}
                          </span>
                        </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-[#800020]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {product.is_featured && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-bold">
                              DESTAQUE
                            </span>
                          )}
                          {product.is_new_arrival && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-full font-bold">
                              NOVIDADE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
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

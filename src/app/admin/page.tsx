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
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_featured: boolean;
  is_new_arrival: boolean;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_featured: false,
    is_new_arrival: false,
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

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

      setFormData({ ...formData, image_url: data.publicUrl });
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

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
        is_featured: false,
        is_new_arrival: false,
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
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto</label>
                <input
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Conjunto Alfaiataria"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <input
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Conjuntos, Vestidos"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#800020] outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do produto..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem do Produto</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400" size={32} />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#800020]" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <ImageIcon size={18} />
                    Selecionar Imagem
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Formatos aceitos: JPG, PNG. Máx 5MB.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm">Em Destaque</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new_arrival}
                  onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                  className="rounded text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm">Novidade</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
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
                      is_featured: false,
                      is_new_arrival: false,
                    });
                  }}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X size={18} />
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2 bg-[#800020] text-white rounded-md hover:bg-[#600018] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Save size={18} /> : <Plus size={18} />)}
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </section>

        {/* Product List */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Seus Produtos</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Produto</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Preço</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {loading ? 'Carregando...' : 'Nenhum produto cadastrado.'}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url || 'https://via.placeholder.com/40'}
                            className="w-10 h-10 rounded object-cover border"
                            alt=""
                          />
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-xl font-bold mb-2">Excluir Produto?</h3>
              <p className="text-gray-600 mb-6">Esta ação não pode ser desfeita. Tem certeza que deseja excluir este produto?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, FileSpreadsheet, Loader2, CheckCircle, ArrowLeft, Copy, Eye, Table } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  sizes: string[];
  colors: string[];
  weight: number;
  height: number;
  width: number;
  length: number;
}

export default function ExportarPage() {
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      setProducts(data);
      setProductCount(data.length);
    }
  }

  function copyToClipboard(text: string, cellId: string) {
    navigator.clipboard.writeText(text);
    setCopiedCell(cellId);
    setTimeout(() => setCopiedCell(null), 1500);
  }

  function formatDescription(desc: string): string {
    const clean = (desc || '').replace(/\n/g, ' ').trim();
    if (clean.length >= 100) return clean;
    return clean + ' - Produto de alta qualidade. Confira as fotos e detalhes. Enviamos para todo Brasil com segurança.';
  }

  function getCategoryName(cat: string): string {
    const mapping: Record<string, string> = {
      'blusas': 'Blusas',
      'vestidos': 'Vestidos',
      'calcas': 'Calças',
      'shorts': 'Shorts',
      'saias': 'Saias',
      'conjuntos': 'Conjuntos',
      'moda-praia': 'Moda Praia',
      'acessorios': 'Acessórios',
    };
    return mapping[cat] || cat || 'Roupas Femininas';
  }

  async function exportToCSV() {
    setLoading(true);
    setExported(false);
    
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      if (!products || products.length === 0) {
        alert('Nenhum produto encontrado para exportar');
        return;
      }

      setProductCount(products.length);

      const headers = [
        'Nome do Produto',
        'Descrição',
        'Preço',
        'Categoria',
        'Tamanhos',
        'Cores',
        'Imagem Principal',
        'Imagens Adicionais',
        'Peso (kg)',
        'Altura (cm)',
        'Largura (cm)',
        'Comprimento (cm)',
        'Estoque'
      ];

      const rows = products.map(product => [
        product.name || '',
        (product.description || '').replace(/\n/g, ' ').replace(/"/g, '""'),
        product.price || '',
        product.category || '',
        Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        Array.isArray(product.colors) ? product.colors.map((c: string) => c.replace(/#/g, '')).join(', ') : '',
        product.image_url || '',
        Array.isArray(product.images) ? product.images.join(' | ') : '',
        product.weight || '',
        product.height || '',
        product.width || '',
        product.length || '',
        '10'
      ]);

      const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
      ].join('\n');

      const BOM = '\uFEFF';
      
      window.parent.postMessage({ 
        type: "OPEN_EXTERNAL_URL", 
        data: { url: `data:text/csv;charset=utf-8,${encodeURIComponent(BOM + csvContent)}` } 
      }, "*");
      
      setExported(true);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar produtos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Exportar Produtos para Shopee</h1>
          <p className="text-gray-600 mt-1">{productCount} produtos prontos para exportar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-orange-800 text-lg mb-3">Como usar na Shopee:</h2>
          <ol className="space-y-2 text-orange-700">
            <li><strong>1.</strong> Baixe o template oficial da Shopee em: <strong>Seller Centre → Meus Produtos → Upload em Massa → Baixar Template</strong></li>
            <li><strong>2.</strong> Abra o template e vá para a aba <strong>"Criar Produtos"</strong></li>
            <li><strong>3.</strong> Use a tabela abaixo para <strong>copiar e colar</strong> os dados nas colunas corretas (dados começam na linha 5)</li>
            <li><strong>4.</strong> Faça upload do template preenchido na Shopee</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Dados dos Produtos</h3>
            <button
              onClick={() => setShowTable(!showTable)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {showTable ? <Eye className="h-4 w-4" /> : <Table className="h-4 w-4" />}
              {showTable ? 'Ocultar Tabela' : 'Mostrar Dados para Copiar'}
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Clique em qualquer célula para copiar o valor. Cole na coluna correspondente do template da Shopee.
          </p>
        </div>

        {showTable && products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">#</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Nome Produto</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Descrição (min 100 chars)</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Preço</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Estoque</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Peso (kg)</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Comprimento</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Largura</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Altura</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">Imagem Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-500">{idx + 1}</td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors max-w-[200px] truncate ${copiedCell === `name-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(product.name, `name-${idx}`)}
                        title={`Clique para copiar: ${product.name}`}
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{product.name}</span>
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors max-w-[250px] ${copiedCell === `desc-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(formatDescription(product.description), `desc-${idx}`)}
                        title="Clique para copiar descrição"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{formatDescription(product.description).substring(0, 50)}...</span>
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `price-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(String(product.price || 0), `price-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          {product.price}
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `stock-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard('10', `stock-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          10
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `weight-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(String(product.weight || 0.3), `weight-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          {product.weight || 0.3}
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `length-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(String(product.length || 30), `length-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          {product.length || 30}
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `width-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(String(product.width || 20), `width-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          {product.width || 20}
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors ${copiedCell === `height-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(String(product.height || 5), `height-${idx}`)}
                        title="Clique para copiar"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400" />
                          {product.height || 5}
                        </div>
                      </td>
                      <td 
                        className={`px-3 py-3 cursor-pointer hover:bg-orange-100 transition-colors max-w-[150px] ${copiedCell === `img-${idx}` ? 'bg-green-100' : ''}`}
                        onClick={() => copyToClipboard(product.image_url || '', `img-${idx}`)}
                        title="Clique para copiar URL da imagem"
                      >
                        <div className="flex items-center gap-1">
                          <Copy className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate text-xs text-blue-600">{product.image_url ? 'URL...' : '-'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Copy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Copiar Todos os Nomes</h2>
                <p className="text-sm text-gray-500">Para colar na coluna "Nome"</p>
              </div>
            </div>
            <button
              onClick={() => {
                const names = products.map(p => p.name).join('\n');
                navigator.clipboard.writeText(names);
                setCopiedCell('all-names');
                setTimeout(() => setCopiedCell(null), 2000);
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                copiedCell === 'all-names' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
            >
              {copiedCell === 'all-names' ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copiedCell === 'all-names' ? 'Copiado!' : 'Copiar Nomes'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Copy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Copiar Todas Descrições</h2>
                <p className="text-sm text-gray-500">Para colar na coluna "Descrição"</p>
              </div>
            </div>
            <button
              onClick={() => {
                const descs = products.map(p => formatDescription(p.description)).join('\n');
                navigator.clipboard.writeText(descs);
                setCopiedCell('all-descs');
                setTimeout(() => setCopiedCell(null), 2000);
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                copiedCell === 'all-descs' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
              }`}
            >
              {copiedCell === 'all-descs' ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copiedCell === 'all-descs' ? 'Copiado!' : 'Copiar Descrições'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Copy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Copiar Todos os Preços</h2>
                <p className="text-sm text-gray-500">Para colar na coluna "Preço"</p>
              </div>
            </div>
            <button
              onClick={() => {
                const prices = products.map(p => p.price || 0).join('\n');
                navigator.clipboard.writeText(prices);
                setCopiedCell('all-prices');
                setTimeout(() => setCopiedCell(null), 2000);
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                copiedCell === 'all-prices' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
              }`}
            >
              {copiedCell === 'all-prices' ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copiedCell === 'all-prices' ? 'Copiado!' : 'Copiar Preços'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Copy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Copiar URLs das Imagens</h2>
                <p className="text-sm text-gray-500">Para colar na coluna "Imagem"</p>
              </div>
            </div>
            <button
              onClick={() => {
                const imgs = products.map(p => p.image_url || '').join('\n');
                navigator.clipboard.writeText(imgs);
                setCopiedCell('all-imgs');
                setTimeout(() => setCopiedCell(null), 2000);
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                copiedCell === 'all-imgs' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              {copiedCell === 'all-imgs' ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copiedCell === 'all-imgs' ? 'Copiado!' : 'Copiar Imagens'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Exportar CSV Simples</h2>
              <p className="text-sm text-gray-500">Para backup ou uso em outras plataformas</p>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

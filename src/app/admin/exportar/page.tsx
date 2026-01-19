'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, FileSpreadsheet, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExportarPage() {
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);
  const [productCount, setProductCount] = useState(0);

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
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `produtos_tinaplus_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExported(true);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar produtos');
    } finally {
      setLoading(false);
    }
  }

  async function exportToShopeeFormat() {
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
        'ps_category',
        'ps_product_name',
        'ps_product_description',
        'ps_sku_name',
        'ps_price',
        'ps_stock',
        'ps_item_weight',
        'ps_height',
        'ps_width',
        'ps_length',
        'ps_main_image',
        'ps_image_2',
        'ps_image_3',
        'ps_image_4',
        'ps_image_5',
        'ps_brand'
      ];

      const rows = products.map(product => {
        const images = Array.isArray(product.images) ? product.images : [];
        return [
          product.category || 'Moda Feminina',
          product.name || '',
          (product.description || '').replace(/\n/g, ' ').replace(/"/g, '""'),
          product.name || '',
          product.price || '',
          '10',
          (parseFloat(product.weight || '0.3') * 1000).toString(),
          product.height || '2',
          product.width || '20',
          product.length || '30',
          product.image_url || '',
          images[0] || '',
          images[1] || '',
          images[2] || '',
          images[3] || '',
          'Tina Plus Fashion'
        ];
      });

      const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
      ].join('\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const fileName = `shopee_produtos_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Tenta abrir em nova aba para contornar bloqueio de iframe
      const downloadUrl = url;
      window.parent.postMessage({ 
        type: "OPEN_EXTERNAL_URL", 
        data: { url: `data:text/csv;charset=utf-8,${encodeURIComponent(BOM + csvContent)}` } 
      }, "*");
      
      // Fallback: tenta download direto também
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Exportar Produtos</h1>
          <p className="text-gray-600 mt-1">Exporte seus produtos para usar em outras plataformas</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {exported && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Exportação concluída!</p>
              <p className="text-sm text-green-600">{productCount} produtos exportados com sucesso</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Formato Shopee</h2>
                <p className="text-sm text-gray-500">Otimizado para importação na Shopee</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Exporta no formato aceito pela Shopee com todas as colunas necessárias para importação em massa.
            </p>

            <div className="bg-orange-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-800">
                <strong>Dica:</strong> Após baixar, você pode precisar ajustar a categoria na planilha para corresponder às categorias da Shopee.
              </p>
            </div>

            <button
              onClick={exportToShopeeFormat}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Exportar para Shopee
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">CSV Completo</h2>
                <p className="text-sm text-gray-500">Todos os dados dos produtos</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Exporta todos os dados dos produtos em formato CSV que pode ser aberto no Excel ou Google Sheets.
            </p>

            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>Inclui:</strong> Nome, descrição, preço, categoria, tamanhos, cores, imagens e dimensões.
              </p>
            </div>

            <button
              onClick={exportToCSV}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Exportar CSV Completo
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4">Como usar na Shopee:</h3>
          <ol className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Clique em "Exportar para Shopee" para baixar a planilha</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Acesse o <strong>Seller Centre</strong> da Shopee</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Vá em <strong>Meus Produtos → Importar Produtos em Massa</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <span>Faça upload da planilha exportada</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">5</span>
              <span>Revise e publique os produtos</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

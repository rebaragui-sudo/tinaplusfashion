'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, ArrowLeft, Copy, Table } from 'lucide-react';
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
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTextArea, setShowTextArea] = useState(false);
  const [exportText, setExportText] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      setProducts(data);
      setProductCount(data.length);
    }
    setLoading(false);
  }

  function formatDescription(desc: string): string {
    const clean = (desc || '').replace(/\n/g, ' ').replace(/\t/g, ' ').trim();
    if (clean.length >= 100) return clean;
    return clean + ' - Produto de alta qualidade. Confira as fotos e detalhes. Enviamos para todo Brasil com segurança e rapidez.';
  }

  function copyAllForShopee() {
    const rows = products.map(p => {
      // Colunas do template Shopee (aba Modelo):
      // A: Categoria (deixar vazio - preencher manual)
      // B: Nome do Produto
      // C: Descrição do Produto
      // D: SKU principal
      // E: Número de Integração de Variação
      // F: Nome da Variação 1
      // G: Opção para Variação 1
      // H: Imagem por Variação
      // I: Nome da Variação 2
      // J: Opção para Variação 2
      // K: Preço
      // L: Estoque
      // M: SKU da Variação
      // N: Template da Tabela de Medidas
      // O: Imagem de Tamanhos
      // P: GTIN (EAN)
      // Q: IDs de compatibilidade
      // R: Imagem de capa
      // S-Z: Imagem do produto 1-8
      // AA: Peso
      // AB: Comprimento
      // AC: Largura
      // AD: Altura
      
      const allImages = [p.image_url, ...(p.images || [])].filter(Boolean);
      
      const cols = [
        '', // A: Categoria (preencher manual)
        p.name || '', // B: Nome do Produto
        formatDescription(p.description), // C: Descrição
        '', // D: SKU principal
        '', // E: Número de Integração
        '', // F: Nome da Variação 1
        '', // G: Opção para Variação 1
        '', // H: Imagem por Variação
        '', // I: Nome da Variação 2
        '', // J: Opção para Variação 2
        String(p.price || 0), // K: Preço
        '10', // L: Estoque
        '', // M: SKU da Variação
        '', // N: Template Tabela Medidas
        '', // O: Imagem de Tamanhos
        '', // P: GTIN (EAN)
        '', // Q: IDs de compatibilidade
        allImages[0] || '', // R: Imagem de capa
        allImages[1] || '', // S: Imagem do produto 1
        allImages[2] || '', // T: Imagem do produto 2
        allImages[3] || '', // U: Imagem do produto 3
        allImages[4] || '', // V: Imagem do produto 4
        allImages[5] || '', // W: Imagem do produto 5
        allImages[6] || '', // X: Imagem do produto 6
        allImages[7] || '', // Y: Imagem do produto 7
        allImages[8] || '', // Z: Imagem do produto 8
        String(p.weight || 0.3), // AA: Peso
        String(p.length || 30), // AB: Comprimento
        String(p.width || 20), // AC: Largura
        String(p.height || 5), // AD: Altura
      ];
      return cols.join('\t');
    });
    
    const text = rows.join('\n');
    setExportText(text);
    setShowTextArea(true);
    
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Exportar para Shopee</h1>
          <p className="text-gray-600 mt-1">{productCount} produtos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Table className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Copiar Dados para Shopee</h2>
            <p className="text-gray-600">
              Clique no botão abaixo para copiar todos os {productCount} produtos.<br/>
              Depois cole no template da Shopee.
            </p>
          </div>

          <button
            onClick={copyAllForShopee}
            disabled={products.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <>
                <CheckCircle className="h-6 w-6" />
                Copiado! Agora cole no Excel da Shopee
              </>
            ) : (
              <>
                <Copy className="h-6 w-6" />
                Copiar Todos os Produtos
              </>
            )}
          </button>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-orange-800 mb-4">Como usar:</h3>
          <ol className="space-y-3 text-orange-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
              <span>Baixe o template da Shopee em: <strong>Seller Centre → Meus Produtos → Upload em Massa</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
              <span>Abra o Excel e vá na aba <strong>"Modelo"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
              <span>Clique no botão <strong>"Copiar Todos os Produtos"</strong> acima</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
              <span>No Excel, clique na célula <strong>A5</strong> (primeira linha de dados, coluna A) e cole (<strong>Ctrl+V</strong>)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
              <span>Ajuste a <strong>categoria</strong> de cada produto manualmente (obrigatório)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">6</span>
              <span>Salve e faça upload na Shopee</span>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Colunas que serão preenchidas (A até AD):</h3>
          <div className="flex flex-wrap gap-2">
            {['Nome (B)', 'Descrição (C)', 'Preço (K)', 'Estoque (L)', 'Imagem capa (R)', 'Imagens 1-8 (S-Z)', 'Peso (AA)', 'Dimensões (AB-AD)'].map((col) => (
              <span key={col} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {col}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Você precisará selecionar a categoria de cada produto no template da Shopee
          </p>
        </div>

        {products.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">Preview dos Produtos</h3>
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-600">Nome</th>
                    <th className="px-3 py-2 text-left text-gray-600">Preço</th>
                    <th className="px-3 py-2 text-left text-gray-600">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.slice(0, 10).map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 truncate max-w-[200px]">{p.name}</td>
                      <td className="px-3 py-2">R$ {p.price}</td>
                      <td className="px-3 py-2">{p.weight || 0.3} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length > 10 && (
              <div className="px-4 py-2 bg-gray-50 text-center text-sm text-gray-500">
                +{products.length - 10} produtos...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Truck, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShippingOption {
  name: string;
  price: number;
  discount: number;
  delivery_time: number;
  error?: string;
}

interface ShippingCalculatorProps {
  product: {
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
  };
}

export default function ShippingCalculator({ product }: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingOption[] | null>(null);

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleCalculate = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      toast.error('Informe um CEP válido');
      return;
    }

    try {
      setLoading(true);
      setResults(null);

      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanCep,
          package: {
            weight: product.weight || 0.5,
            height: product.height || 10,
            width: product.width || 15,
            length: product.length || 20,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular frete');
      }

      // SuperFrete response can be an array or an object depending on the version/service
      // Assuming it's an array based on standard patterns
      setResults(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Calculate shipping error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/30 rounded-xl p-5 border border-secondary/50">
      <div className="flex items-center gap-2 mb-4">
        <Truck size={20} className="text-[#800020]" />
        <h3 className="font-bold text-sm uppercase tracking-tight">Calcular Frete e Prazo</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(formatCEP(e.target.value))}
          className="flex-grow bg-white border-secondary h-10"
        />
        <Button 
          onClick={handleCalculate} 
          disabled={loading || cep.length < 9}
          className="bg-[#800020] hover:bg-[#600018] h-10 px-4"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
        </Button>
      </div>

      {results && results.length > 0 && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {results.map((option, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-secondary/50 shadow-sm"
            >
              <div>
                <span className="text-xs font-bold text-[#800020] uppercase block">{option.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  Entrega em até {option.delivery_time} {option.delivery_time === 1 ? 'dia útil' : 'dias úteis'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                </span>
                {option.discount > 0 && (
                  <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1 rounded">
                    ECONOMIA DE {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.discount)}
                  </span>
                )}
              </div>
            </div>
          ))}
          <p className="text-[9px] text-center text-muted-foreground mt-2">
            Valores e prazos fornecidos pelo SuperFrete.
          </p>
        </div>
      )}

      {results && results.length === 0 && !loading && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">Nenhuma opção de frete disponível para este CEP.</p>
        </div>
      )}
    </div>
  );
}

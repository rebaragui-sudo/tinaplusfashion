'use client';

import React, { useState } from 'react';
import { Truck, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShippingOption {
  name: string;
  price: number;
  days: string;
}

export function ShippingCalculator() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleCalculate = async () => {
    const rawCep = cep.replace(/\D/g, '');
    
    if (rawCep.length !== 8) {
      toast.error('Por favor, informe um CEP válido (8 dígitos)');
      return;
    }

    setLoading(true);
    setOptions(null);

    try {
      // Mock calculation for demonstration
      // In a real app, you would call a shipping API
      await new Promise(resolve => setTimeout(resolve, 800));
      
        const results: ShippingOption[] = [
          { name: 'PAC', price: 15.90, days: '7 a 10 dias úteis' },
          { name: 'SEDEX', price: 29.90, days: '2 a 4 dias úteis' },
          { name: 'Entrega Expressa', price: 45.00, days: '1 a 2 dias úteis' },
          { name: 'Ônibus / Transportadora', price: 0, days: 'A combinar' }
        ];

      setOptions(results);
    } catch (error) {
      toast.error('Erro ao calcular o frete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-xl bg-gray-50/50">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="text-[#800020]" size={18} />
        <h4 className="text-sm font-bold uppercase tracking-tight">Calcular Frete</h4>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(formatCEP(e.target.value))}
          className="bg-white"
          maxLength={9}
        />
        <Button 
          onClick={handleCalculate}
          disabled={loading}
          className="bg-[#800020] hover:bg-[#600018] text-white shrink-0"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Calcular'}
        </Button>
      </div>

      <a 
        href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[10px] text-muted-foreground hover:underline mt-2 inline-block"
      >
        Não sei meu CEP
      </a>

      {options && (
        <div className="mt-4 space-y-2 border-t pt-4">
          {options.map((option, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-gray-100 shadow-sm">
              <div>
                <span className="text-xs font-bold block">{option.name}</span>
                <span className="text-[10px] text-muted-foreground">{option.days}</span>
              </div>
                <span className="text-sm font-bold text-[#800020]">
                  {option.price === 0 ? 'A combinar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

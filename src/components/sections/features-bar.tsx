import React from 'react';
import { Ruler, RefreshCw, Truck, Headset } from 'lucide-react';

/**
 * FeaturesBar Component
 * Clones the horizontal features bar located above the footer with pixel-perfect accuracy.
 * Features: Tabela de Medidas, Troca Fácil, Entrega Brasil, Atendimento.
 */
const FeaturesBar = () => {
  const features = [
    {
      icon: <Ruler className="w-6 h-6 text-[#9a866d]" />,
      title: 'Tabela de Medidas',
      description: 'Guia completo',
      bgColor: 'transparent',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#9a866d]" />,
      title: 'Troca Fácil',
      description: 'Até 30 dias',
      bgColor: 'transparent',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#9a866d]" />,
      title: 'Entrega Brasil',
      description: 'Para todo país',
      bgColor: 'transparent',
    },
    {
      icon: <Headset className="w-6 h-6 text-[#9a866d]" />,
      title: 'Atendimento',
      description: 'Rápido e humanizado',
      bgColor: 'transparent',
    },
  ];

  return (
    <section className="w-full bg-[#f3eee7] py-8 md:py-10 border-t border-[#e4e4e7]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 items-center">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center md:justify-start gap-4 group cursor-default"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110">
                {/* Custom rendering based on the icons seen in the reference screenshot */}
                {index === 0 && (
                   <span className="text-2xl">📏</span>
                )}
                {index === 1 && (
                   <span className="text-2xl">🔄</span>
                )}
                {index === 2 && (
                   <span className="text-2xl">🚚</span>
                )}
                {index === 3 && (
                   <span className="text-2xl">💬</span>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-[#18181b] uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
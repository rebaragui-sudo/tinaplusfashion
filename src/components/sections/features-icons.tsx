import React from 'react';
import { Ruler, RefreshCw, Truck, Headset } from 'lucide-react';

const FeaturesIcons = () => {
  const features = [
    {
      icon: <Ruler className="w-6 h-6 text-[#D4AF37]" />,
      title: "Tabela de Medidas",
      subtitle: "Guia completo",
      iconBg: "bg-transparent"
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#5A8DAE]" />,
      title: "Troca Fácil",
      subtitle: "Até 30 dias",
      iconBg: "bg-transparent"
    },
    {
      icon: <Truck className="w-6 h-6 text-[#C96B44]" />,
      title: "Entrega Brasil",
      subtitle: "Para todo país",
      iconBg: "bg-transparent"
    },
    {
      icon: <Headset className="w-6 h-6 text-[#4B4B4B]" />,
      title: "Atendimento",
      subtitle: "Rápido e humanizado",
      iconBg: "bg-transparent"
    }
  ];

  return (
    <section className="w-full bg-[#F5F3F1] border-t border-[#E4E4E7] py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-x-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center md:justify-start gap-4 px-2"
            >
              <div className={`flex shrink-0 items-center justify-center p-1`}>
                {/* 
                  Note: Using Lucide icons as a close approximation for the custom 
                  styled icons seen in the screenshots to ensure visual consistency
                  and high-quality rendering.
                */}
                {React.cloneElement(feature.icon, {
                  strokeWidth: 1.5,
                  className: "w-7 h-7 md:w-8 md:h-8"
                })}
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-[#121218] leading-tight font-sans">
                  {feature.title}
                </span>
                <span className="text-xs md:text-sm text-[#71717A] font-normal leading-tight font-sans">
                  {feature.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesIcons;
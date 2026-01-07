import React from 'react';
import { Truck, CreditCard, Lock } from 'lucide-react';

const InfoBanner = () => {
  const items = [
    {
      icon: <Truck size={18} className="text-white fill-current" />,
      title: "Enviamos suas compras",
      description: "Entrega em todo o país",
    },
    {
      icon: <CreditCard size={18} className="text-white fill-current" />,
      title: "Pague como quiser",
      description: "Cartões de crédito ou à vista",
    },
    {
      icon: <Lock size={18} className="text-white fill-current" />,
      title: "Compre com segurança",
      description: "Seus dados sempre protegidos",
    },
  ];

    return (
      <section 
        className="w-full bg-secondary py-8 border-b border-border"
        aria-label="Informações da loja"
      >
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center space-y-2 md:px-4"
              >
                <div className="flex items-center justify-center mb-1 text-foreground">
                  <span className="flex items-center gap-3">
                    {/* Customizing Lucide icons to match the aesthetic if specific assets aren't present */}
                    {React.cloneElement(item.icon, {
                      className: "w-[20px] h-[20px] stroke-[1.5] text-primary",
                    })}
                    <h3 className="font-display text-[13px] md:text-[14px] font-bold uppercase tracking-[0.15em] text-foreground">
                      {item.title}
                    </h3>
                  </span>
                </div>
                <p className="font-sans text-[12px] md:text-[14px] text-muted-foreground leading-relaxed uppercase tracking-wider">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default InfoBanner;
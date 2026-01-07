import React from 'react';

/**
 * ModelHighlights Component
 * 
 * This component clones the promotional banners for "MODELO ADRIELLE" and "MODELO KAROL"
 * with pixel-perfect accuracy to the source design.
 * 
 * - Theme: Dark (Deep Burgundy #3d0021)
 * - Typography: Roboto Condensed for headers/buttons, Roboto for body.
 * - Colors: Background (#541d3b for card surface), Button (#9c848d), Text (#ffffff).
 */

const ModelHighlights: React.FC = () => {
  return (
    <section className="py-[60px] bg-[#3d0021]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col gap-[30px]">
          
          {/* MODELO ADRIELLE Banner */}
          <div className="relative w-full min-h-[300px] bg-[#541d3b] flex items-center justify-start p-8 md:p-12 overflow-hidden">
            {/* The background of these specific banners in the screenshots is a solid lighter burgundy block with dark overlays */}
            <div className="z-10 bg-[#3d0021]/80 md:bg-[#3d0021] border border-[#9c848d]/20 p-6 md:p-8 max-w-sm">
              <h3 className="font-display text-lg font-bold text-white mb-4 tracking-widest uppercase">
                MODELO ADRIELLE
              </h3>
              <p className="font-sans text-[11px] leading-relaxed text-[#ffffff] uppercase tracking-wider mb-6">
                TAMANHO: GG, ALTURA: 1,60 cm, NÚMERO: 48-50, BUSTO: 116 cm, CINTURA: 115 cm, QUADRIL: 135 cm
              </p>
              <a 
                href="/tamanho-gg" 
                className="inline-block bg-[#9c848d] text-[#3d0021] px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
              >
                VER PRODUTOS GG
              </a>
            </div>
          </div>

          {/* MODELO KAROL Banner */}
          <div className="relative w-full min-h-[300px] bg-[#541d3b] flex items-center justify-end p-8 md:p-12 overflow-hidden text-right">
            <div className="z-10 bg-[#3d0021]/80 md:bg-[#3d0021] border border-[#9c848d]/20 p-6 md:p-8 max-w-sm md:text-right">
              <h3 className="font-display text-lg font-bold text-white mb-4 tracking-widest uppercase">
                MODELO KAROL
              </h3>
              <p className="font-sans text-[11px] leading-relaxed text-[#ffffff] uppercase tracking-wider mb-6">
                TAMANHO: G2, ALTURA: 1,73 cm, NÚMERO: 52-54, BUSTO: 135 cm, CINTURA: 117 cm, QUADRIL: 150 cm
              </p>
              <div className="flex md:justify-end">
                <a 
                  href="/tamanho-g2" 
                  className="inline-block bg-[#9c848d] text-[#3d0021] px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
                >
                  VER PRODUTOS G2
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ModelHighlights;
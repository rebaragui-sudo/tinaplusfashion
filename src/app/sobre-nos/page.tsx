import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { MapPin } from "lucide-react";

export default function SobreNos() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121812] mb-8 text-center">
            Sobre <span className="text-[#D4AF37]">Nós</span>
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#71717a] space-y-6">
            <p>
              A <strong>Tina Plus</strong> nasceu do desejo de proporcionar moda plus size com elegância, 
              conforto e o caimento perfeito que toda mulher merece. Acreditamos que o estilo não tem 
              tamanho e que cada peça deve celebrar a beleza única de quem a veste.
            </p>
            
            <p>
              Nossa curadoria é feita com foco na qualidade dos tecidos e no design sofisticado, 
              trazendo as últimas tendências para o universo plus size de forma autêntica e moderna.
            </p>

            <div className="bg-[#f5f3f1] p-8 rounded-2xl border border-[#e4e4e7] mt-12">
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37] p-3 rounded-full text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121812] mb-2">Nosso Endereço Físico</h2>
                  <p className="text-lg text-[#121812]">
                    Rua Alexandrino Pedroso, 43
                  </p>
                  <p className="text-sm text-[#71717a]">
                    Canindé, São Paulo - SP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

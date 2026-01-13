import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { RefreshCcw } from "lucide-react";

export default function TrocasEDevolucoes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121812] mb-8 text-center">
            Trocas e <span className="text-[#D4AF37]">Devoluções</span>
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#71717a] space-y-6">
            <div className="bg-[#f5f3f1] p-8 rounded-2xl border border-[#e4e4e7] mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37] p-3 rounded-full text-white">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121812] mb-2">Política de Troca</h2>
                  <p className="text-lg text-[#121812]">
                    Oferecemos trocas até <strong>7 dias</strong> após a compra.
                  </p>
                  <p className="text-sm text-[#71717a]">
                    A peça deve estar em perfeitas condições e com a etiqueta original.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#121812]">Como solicitar?</h3>
            <p>
              Para solicitar uma troca ou devolução, entre em contato conosco através do nosso WhatsApp 
              ou visite nossa loja física na Rua Alexandrino Pedroso, 43.
            </p>
            
            <h3 className="text-2xl font-bold text-[#121812]">Condições Gerais</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>O produto não pode apresentar sinais de uso ou lavagem.</li>
              <li>Deve estar acompanhado da nota fiscal ou comprovante de compra.</li>
              <li>Reservamo-nos o direito de recusar a troca caso as condições acima não sejam atendidas.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

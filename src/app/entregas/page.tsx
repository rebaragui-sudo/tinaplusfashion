import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Truck } from "lucide-react";

export default function Entregas() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121812] mb-8 text-center">
            Prazos e <span className="text-[#D4AF37]">Entregas</span>
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#71717a] space-y-6">
            <div className="bg-[#f5f3f1] p-8 rounded-2xl border border-[#e4e4e7] mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37] p-3 rounded-full text-white">
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121812] mb-2">Informações de Entrega</h2>
                  <p className="text-lg text-[#121812]">
                    Entregamos para todo o Brasil com segurança e agilidade.
                  </p>
                  <p className="text-sm text-[#71717a]">
                    Os prazos variam de acordo com a sua região e o método de envio selecionado.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#121812]">Prazos de Postagem</h3>
            <p>
              Após a confirmação do pagamento, seu pedido será processado e postado em até <strong>2 dias úteis</strong>. 
              Você receberá um código de rastreamento para acompanhar cada etapa da entrega.
            </p>
            
            <h3 className="text-2xl font-bold text-[#121812]">Métodos de Envio</h3>
            <p className="!whitespace-pre-line !whitespace-pre-line">Trabalhamos com os Correios e transportadoras parceiras para garantir que sua encomenda chegue em perfeito estado. Você pode simular o frete e o prazo diretamente na sacola de compras, ou para compras em grande quantidade entregamos nos ônibus de excursão, entre em contato com a gente pelo WhatsApp.


            </p>
            
            <h3 className="text-2xl font-bold text-[#121812]">Retirada na Loja</h3>
            <p>
              Se preferir, você pode retirar seu pedido em nossa loja física sem custo de frete:
            </p>
            <div className="bg-white p-4 rounded-lg border border-[#e4e4e7] mt-2">
              <p className="font-bold text-[#121812]">Tina Plus</p>
              <p>Rua Alexandrino Pedroso, 43</p>
              <p>Canindé, São Paulo - SP</p>
              <p className="text-sm mt-2">Segunda a Sexta: 7h às 15h</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>);

}
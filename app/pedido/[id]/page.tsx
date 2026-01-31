import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Clock, CheckCircle2, Bike, MapPin, Banknote } from "lucide-react";
import Link from "next/link";
import { AutoRefresh } from "@/components/auto-refresh";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return notFound();

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(order.total);

  // Lógica de Status
  const isRealizado = order.status === "PEDIDO_REALIZADO";
  const isSaiuEntrega = order.status === "SAIU_PARA_ENTREGA";
  const isEntregue = order.status === "ENTREGUE";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <AutoRefresh interval={10000} />

      {/* CABEÇALHO GIGANTE */}
      <div
        className={`transition-colors duration-500 ${isEntregue ? "bg-green-600" : "bg-sushi-red"} text-white p-12 text-center rounded-b-[50px] shadow-2xl`}
      >
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          {isEntregue ? <CheckCircle2 size={48} /> : <ShoppingBag size={48} />}
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
          {isEntregue ? "Pedido Entregue!" : "Acompanhe seu Pedido"}
        </h1>
        <p className="text-xl opacity-80 font-bold uppercase tracking-widest">
          ID: #{order.id.slice(-4).toUpperCase()}
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100 space-y-10">
          {/* SEÇÃO DE STATUS COM TIPOGRAFIA BLACK */}
          <div>
            <h3 className="text-2xl font-black text-gray-800 mb-10 flex items-center gap-3 italic uppercase tracking-tight">
              <Clock className="text-sushi-red" size={28} /> Status Atual
            </h3>

            <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-1 before:bg-gray-100">
              {/* STATUS 1 */}
              <div className="flex gap-6 relative">
                <div
                  className={`z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isRealizado ? "bg-sushi-red animate-pulse" : "bg-green-500"}`}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <p
                    className={`text-2xl font-black leading-none ${isRealizado ? "text-sushi-red" : "text-gray-400"}`}
                  >
                    Pedido Recebido
                  </p>
                  <p className="text-sm font-bold text-gray-400 uppercase mt-2">
                    Recebemos seu pedido na cozinha
                  </p>
                </div>
              </div>

              {/* STATUS 2 */}
              <div className="flex gap-6 relative">
                <div
                  className={`z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isSaiuEntrega ? "bg-blue-600 animate-bounce" : isEntregue ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <Bike size={18} className="text-white" />
                </div>
                <div>
                  <p
                    className={`text-2xl font-black leading-none ${isSaiuEntrega ? "text-blue-700" : "text-gray-400"}`}
                  >
                    Saiu para Entrega
                  </p>
                  <p className="text-sm font-bold text-gray-400 uppercase mt-2">
                    O motoboy já iniciou o percurso
                  </p>
                </div>
              </div>

              {/* STATUS 3 */}
              <div className="flex gap-6 relative">
                <div
                  className={`z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isEntregue ? "bg-green-600 shadow-green-200" : "bg-gray-200"}`}
                >
                  <CheckCircle2 size={18} className="text-white" />
                </div>
                <div>
                  <p
                    className={`text-2xl font-black leading-none ${isEntregue ? "text-green-600" : "text-gray-400"}`}
                  >
                    Entregue
                  </p>
                  <p className="text-sm font-bold text-gray-400 uppercase mt-2">
                    Aproveite sua refeição!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMO DO ENDEREÇO */}
          <div className="pt-8 border-t border-dashed border-gray-200">
            <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <MapPin className="text-sushi-red mt-1" size={24} />
              <div>
                <p className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">
                  Endereço de Entrega
                </p>
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {order.address}
                </p>
              </div>
            </div>
          </div>

          {/* RESUMO DO PAGAMENTO E TOTAL */}
          <div className="pt-8 border-t-4 border-gray-50">
            <div className="flex justify-between items-center bg-sushi-red/5 p-6 rounded-2xl border border-sushi-red/10">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  Total Pago
                </span>
                <span className="text-4xl font-black text-sushi-red tracking-tighter">
                  {formattedTotal}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">
                  Método
                </span>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  <Banknote size={16} className="text-green-600" />
                  <span className="text-sm font-black text-gray-700">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full text-center p-6 bg-gray-900 text-white rounded-[20px] font-black uppercase text-sm tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Fazer Novo Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}

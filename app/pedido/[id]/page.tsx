import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock, MapPin, Phone, Banknote } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) return notFound();
  // Busca o pedido no banco
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return notFound();

  // Função para gerar o texto do WhatsApp
  const whatsappMessage = encodeURIComponent(
    `*OLÁ! ACABEI DE FAZER UM PEDIDO* 🍣
ID: #${order.id.slice(0, 5)}...

*Nome:* ${order.customerName}
*Endereço:* ${order.address}
--------------------------------
${order.items.map((item) => `${item.quantity}x ${item.name}`).join("\n")}
--------------------------------
*Total: R$ ${order.total.toFixed(2).replace(".", ",")}*
*Pagamento:* ${order.paymentMethod} ${order.changeFor ? `(Troco para ${order.changeFor})` : ""}

*Acompanhe o pedido aqui:*
${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/pedido/${order.id}`,
  );

  const whatsappLink = `https://wa.me/5522988255351?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Verde de Sucesso */}
      <div className="bg-green-600 p-6 text-white text-center shadow-lg">
        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-bold font-display">Pedido Recebido!</h1>
        <p className="opacity-90">Agora é só acompanhar o status.</p>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6 -mt-6">
        {/* Card de Status */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-sushi-red" /> Status em Tempo Real
          </h2>

          <div className="space-y-6 relative pl-4 border-l-2 border-gray-200 ml-2">
            {/* Status 1: Recebido */}
            <div className="relative">
              <div className="absolute -left-5.25 bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-green-100"></div>
              <p className="font-bold text-green-700 text-sm">Pedido Recebido</p>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
              </p>
            </div>

            {/* Status 2: Preparando (Lógica visual simples) */}
            <div className="relative">
              <div
                className={`absolute -left-5.25 w-4 h-4 rounded-full border-2 border-white ${order.status === "PREPARANDO" || order.status === "ENTREGA" ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <p
                className={`font-bold text-sm ${order.status === "PREPARANDO" ? "text-green-700" : "text-gray-400"}`}
              >
                Em Preparo
              </p>
            </div>

            {/* Status 3: Saiu para Entrega */}
            <div className="relative">
              <div
                className={`absolute -left-5.25 w-4 h-4 rounded-full border-2 border-white ${order.status === "ENTREGA" ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <p
                className={`font-bold text-sm ${order.status === "ENTREGA" ? "text-green-700" : "text-gray-400"}`}
              >
                Saiu para Entrega
              </p>
            </div>
          </div>

          {/* BOTÃO WHATSAPP - OBRIGATÓRIO PARA CONFIRMAR */}
          <a
            href={whatsappLink}
            target="_blank"
            className="mt-6 w-full bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg animate-pulse"
          >
            <Phone size={20} /> Enviar Confirmação no Zap
          </a>
          <p className="text-xs text-center text-gray-400 mt-2">
            Clique para enviar o pedido para a cozinha
          </p>
        </div>

        {/* Detalhes do Pedido */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h3 className="font-bold text-gray-700">
              Resumo do Pedido #{order.id.slice(-4)}
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  <span className="font-bold">{item.quantity}x</span> {item.name}
                </span>
                <span className="text-gray-600">R$ {item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-sushi-red">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Dados de Entrega */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-bold text-sm text-gray-700">Endereço de Entrega</p>
              <p className="text-sm text-gray-500">{order.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t pt-3">
            <Banknote className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-bold text-sm text-gray-700">Pagamento</p>
              <p className="text-sm text-gray-500">
                {order.paymentMethod}
                {order.changeFor && (
                  <span className="text-xs ml-1 bg-yellow-100 px-1 rounded text-yellow-800">
                    Troco p/ {order.changeFor}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

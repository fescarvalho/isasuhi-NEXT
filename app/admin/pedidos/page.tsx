import { prisma } from "@/lib/prisma";
import { updateOrderStatus, getStoreStatus } from "@/app/actions"; // <--- Adicionei getStoreStatus
import { AdminNav } from "@/components/admin-nav";
import { AutoRefresh } from "@/components/auto-refresh";
import { MessageCircle } from "lucide-react";

export default async function AdminOrders() {
  // 1. Busca se a loja está aberta
  const isStoreOpen = await getStoreStatus();

  // 2. Busca os pedidos ordenados por CHEGADA (Antigos primeiro, novos por último)
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "asc" }, // <--- Mudado para ASC
  });

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Passamos o status para o menu mostrar o botão correto */}
      <AdminNav isStoreOpen={isStoreOpen} />

      <AutoRefresh />

      <div className="p-6 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-bold mb-6 font-display text-gray-800">
          Fila de Pedidos
        </h2>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">Tudo calmo por enquanto...</p>
              <p className="text-sm text-gray-300">Nenhum pedido na fila.</p>
            </div>
          ) : (
            orders.map((order) => {
              const cleanPhone = order.customerPhone.replace(/\D/g, "");
              const message = encodeURIComponent(
                `Olá ${order.customerName}! Recebemos seu pedido no Isa Sushi 🍣.\n\nAcompanhe o status e a entrega pelo link abaixo:\n${baseUrl}/pedido/${order.id}`,
              );
              const whatsappLink = `https://wa.me/55${cleanPhone}?text=${message}`;

              return (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{order.customerName}</h3>
                        <span className="text-xs text-gray-400">
                          #{order.id.slice(-4)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      <p className="text-sm text-gray-600 mt-1 max-w-md">
                        {order.address}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        order.status === "PENDENTE"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "PREPARANDO"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "ENTREGA"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 mb-4 border border-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          <span className="font-bold">{item.quantity}x</span> {item.name}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>R$ {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      className="flex items-center gap-2 text-sm font-bold text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors border border-green-200 w-full sm:w-auto justify-center"
                    >
                      <MessageCircle size={18} /> Notificar Cliente
                    </a>

                    <form
                      action={async (formData) => {
                        "use server";
                        const id = formData.get("id") as string;
                        const status = formData.get("status") as string;
                        await updateOrderStatus(id, status);
                      }}
                      className="flex gap-2 w-full sm:w-auto"
                    >
                      <input type="hidden" name="id" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="border rounded-lg p-2 text-sm bg-gray-50 flex-1"
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="PREPARANDO">Preparando</option>
                        <option value="ENTREGA">Saiu p/ Entrega</option>
                        <option value="CONCLUIDO">Concluído</option>
                      </select>
                      <button className="bg-sushi-black hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Atualizar
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

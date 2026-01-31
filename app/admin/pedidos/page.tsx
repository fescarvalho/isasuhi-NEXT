import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { AutoRefresh } from "@/components/auto-refresh";
import { StatusDropdown } from "@/components/status-dropdown";
import { Search, Calendar, Package, Trash2, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStoreStatus, clearAllOrders } from "@/app/actions";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    nome?: string;
    data?: string;
  }>;
}

export default async function AdminPedidos({ searchParams }: PageProps) {
  const isStoreOpen = await getStoreStatus();
  const { nome, data } = await searchParams;

  const onde: Prisma.OrderWhereInput = {};

  if (nome) {
    onde.customerName = {
      contains: nome,
      mode: "insensitive",
    };
  }

  if (data) {
    const dataInicio = new Date(`${data}T00:00:00`);
    const dataFim = new Date(`${data}T23:59:59`);
    onde.createdAt = {
      gte: dataInicio,
      lte: dataFim,
    };
  }

  const pedidos = await prisma.order.findMany({
    where: onde,
    include: { items: true },
    orderBy: { createdAt: "asc" }, // OS PRIMEIROS DO DIA EM CIMA
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />
      <AutoRefresh interval={15000} />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 font-display uppercase tracking-tighter italic">
            Gestão de Pedidos
          </h2>

          <form
            action={async () => {
              "use server";
              await clearAllOrders();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-50 text-red-600 border-2 border-red-100 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest shadow-sm"
            >
              <Trash2 size={14} /> Zerar Sistema
            </button>
          </form>
        </div>

        {/* --- FILTROS --- */}
        <form className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[280px]">
            <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest ml-1">
              Buscar Cliente
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="nome"
                defaultValue={nome}
                placeholder="Nome do cliente..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-sushi-red rounded-2xl outline-none text-black font-bold transition-all"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest ml-1">
              Data
            </label>
            <input
              type="date"
              name="data"
              defaultValue={data}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-sushi-red rounded-2xl outline-none text-black font-bold transition-all"
            />
          </div>

          <button
            type="submit"
            className="bg-sushi-red text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            Filtrar
          </button>
        </form>

        {/* --- LISTAGEM --- */}
        <div className="grid gap-6">
          {pedidos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-200">
              <Package className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-bold text-xl uppercase tracking-tighter">
                Nenhum pedido na fila
              </p>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white p-6 rounded-[32px] shadow-xl shadow-gray-200/50 border-2 border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-black transition-all hover:scale-[1.01]"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-white bg-sushi-red px-3 py-1 rounded-full shadow-sm">
                      #{pedido.id.slice(-4).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 font-black text-xs bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      <Clock size={14} className="text-sushi-red" />
                      {format(new Date(pedido.createdAt), "HH:mm '•' dd/MM", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-2">
                    <User size={24} className="text-gray-300" />
                    {pedido.customerName}
                  </h3>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                      <Package size={14} />
                      {pedido.items.length} PRODUTOS
                    </div>
                    <div className="text-sushi-red font-black text-2xl tracking-tighter">
                      R$ {pedido.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 border-t md:border-t-0 pt-5 md:pt-0">
                  <div className="flex flex-col gap-1.5 w-full sm:w-56">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      Status do Pedido
                    </label>
                    <StatusDropdown orderId={pedido.id} currentStatus={pedido.status} />
                  </div>

                  <a
                    href={`/pedido/${pedido.id}`}
                    target="_blank"
                    className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all text-center shadow-lg active:scale-95"
                  >
                    Ver Detalhes
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

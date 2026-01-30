import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { AutoRefresh } from "@/components/auto-refresh";
import { Search, Calendar, Package, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStoreStatus /* clearAllOrders */ } from "@/app/actions";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Tipagem correta para os parâmetros de busca
interface PageProps {
  searchParams: Promise<{
    nome?: string;
    data?: string;
  }>;
}

export default async function AdminPedidos({ searchParams }: PageProps) {
  const isStoreOpen = await getStoreStatus();
  const { nome, data } = await searchParams;

  // Construção do filtro com tipagem estrita do Prisma
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />
      <AutoRefresh />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            Gestão de Pedidos
          </h2>

          {/* Formulário simples para o botão de apagar tudo */}
          {/*   <form
            action={async () => {
              "use server";
              await clearAllOrders();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              <Trash2 size={14} /> Zerar Sistema
            </button>
          </form> */}
        </div>

        {/* --- FORMULÁRIO DE FILTRO --- */}
        <form className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">
              Nome do Cliente
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="nome"
                defaultValue={nome}
                placeholder="Buscar cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sushi-red/20 outline-none text-black"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">
              Data
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                name="data"
                defaultValue={data}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sushi-red/20 outline-none text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-sushi-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Filtrar
          </button>

          <a
            href="/admin/pedidos"
            className="text-sm text-gray-500 hover:text-red-600 underline py-2"
          >
            Limpar
          </a>
        </form>

        {/* --- LISTAGEM --- */}
        <div className="grid gap-4">
          {pedidos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-black"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-sushi-red bg-red-50 px-2 py-0.5 rounded">
                      #{pedido.id.slice(-4).toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {format(new Date(pedido.createdAt), "HH:mm '•' dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {pedido.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {pedido.items.length} itens • Total: R$ {pedido.total.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase">
                    {pedido.status}
                  </span>
                  <a
                    href={`/pedido/${pedido.id}`}
                    className="text-sm font-bold text-sushi-red hover:underline"
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

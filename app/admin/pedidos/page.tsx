import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { AutoRefresh } from "@/components/auto-refresh";
import { StatusDropdown } from "@/components/status-dropdown";
import {
  Search,
  Package,
  Trash2,
  Clock,
  User,
  MapPin,
  Banknote,
  CalendarRange, // Novo ícone para período
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStoreStatus, clearAllOrders } from "@/app/actions";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    nome?: string;
    dataInicio?: string; // Alterado de 'data' para inicio
    dataFim?: string; // Adicionado fim
  }>;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  orderId: string;
}

export default async function AdminPedidos({ searchParams }: PageProps) {
  const isStoreOpen = await getStoreStatus();
  // Buscamos dataInicio e dataFim da URL
  const { nome, dataInicio, dataFim } = await searchParams;

  const onde: any = {};

  if (nome) {
    onde.customerName = {
      contains: nome,
      mode: "insensitive",
    };
  }

  // Lógica de Filtro por Período
  if (dataInicio || dataFim) {
    onde.createdAt = {};

    if (dataInicio) {
      // Começa à 00:00:00 da data inicial
      onde.createdAt.gte = new Date(`${dataInicio}T00:00:00`);
    }

    if (dataFim) {
      // Termina às 23:59:59 da data final
      onde.createdAt.lte = new Date(`${dataFim}T23:59:59`);
    }
  }

  const pedidos = await prisma.order.findMany({
    where: onde,
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />
      <AutoRefresh interval={15000} />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter italic">
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

        {/* --- FILTROS DE PERÍODO --- */}
        <form className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
          {/* Busca por Nome */}
          <div className="flex-1 w-full md:w-auto">
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

          {/* Data Início */}
          <div className="w-full md:w-auto">
            <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest ml-1">
              De (Início)
            </label>
            <div className="relative">
              <CalendarRange
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                name="dataInicio"
                defaultValue={dataInicio}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-sushi-red rounded-2xl outline-none text-black font-bold transition-all uppercase"
              />
            </div>
          </div>

          {/* Data Fim */}
          <div className="w-full md:w-auto">
            <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest ml-1">
              Até (Fim)
            </label>
            <div className="relative">
              <CalendarRange
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                name="dataFim"
                defaultValue={dataFim}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-sushi-red rounded-2xl outline-none text-black font-bold transition-all uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-sushi-red text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            Filtrar
          </button>

          {/* Botão Limpar Filtros */}
          {(nome || dataInicio || dataFim) && (
            <a
              href="/admin/pedidos"
              className="w-full md:w-auto text-center text-xs font-bold text-gray-400 hover:text-red-500 py-3 underline"
            >
              Limpar
            </a>
          )}
        </form>

        {/* --- LISTAGEM DETALHADA --- */}
        <div className="grid gap-8">
          {pedidos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-200">
              <Package className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-bold text-xl uppercase tracking-tighter">
                Nenhum pedido encontrado
              </p>
            </div>
          ) : (
            pedidos.map((pedido: any) => (
              <div
                key={pedido.id}
                className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border-2 border-gray-100 overflow-hidden flex flex-col text-black transition-all hover:border-gray-200"
              >
                {/* CABEÇALHO DO PEDIDO */}
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white bg-sushi-red px-3 py-1 rounded-full shadow-sm">
                        #{pedido.id.slice(-4).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-500 font-black text-xs bg-white border border-gray-200 px-3 py-1 rounded-full uppercase tracking-wider">
                        <Clock size={14} className="text-sushi-red" />
                        {format(new Date(pedido.createdAt), "HH:mm '•' dd/MM", {
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-2 mt-2">
                      <User size={24} className="text-gray-300" />
                      {pedido.customerName}
                    </h3>
                  </div>

                  <div className="flex flex-col md:items-end justify-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">
                        Total do Pedido
                      </span>
                      <span className="text-3xl font-black text-sushi-red tracking-tighter italic">
                        R$ {pedido.total.toFixed(2)}
                      </span>
                    </div>
                    <StatusDropdown orderId={pedido.id} currentStatus={pedido.status} />
                  </div>
                </div>

                {/* CONTEÚDO: ITENS + ENDEREÇO */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* COLUNA 1: PRODUTOS */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Package size={16} className="text-sushi-red" /> Itens Selecionados
                    </h4>
                    <div className="bg-white border-2 border-gray-50 rounded-2xl divide-y divide-gray-50 shadow-sm">
                      {pedido.items.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="p-4 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white font-black rounded-xl text-sm">
                              {item.quantity}x
                            </span>
                            <span className="font-black text-gray-800 uppercase text-sm tracking-tight">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-bold text-gray-400 text-xs tracking-tighter">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUNA 2: ENDEREÇO E PAGAMENTO */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                        <MapPin size={16} className="text-sushi-red" /> Dados de Entrega
                      </h4>
                      <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg italic">
                        <p className="font-black text-lg leading-tight uppercase mb-1 tracking-tight">
                          {pedido.address}
                        </p>
                        <p className="text-sm font-bold text-sushi-red uppercase tracking-widest">
                          {pedido.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 font-black uppercase text-xs text-yellow-800 tracking-widest">
                        <Banknote size={20} />
                        Pagamento: {pedido.paymentMethod}
                      </div>
                      {pedido.changeFor && (
                        <span className="bg-white border border-yellow-200 px-3 py-1 rounded-lg text-[10px] font-black text-red-600 uppercase">
                          Troco p/ R$ {pedido.changeFor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RODAPÉ COM LINK */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                  <a
                    href={`/pedido/${pedido.id}`}
                    target="_blank"
                    className="text-[10px] font-black text-gray-400 uppercase hover:text-sushi-red transition-all underline tracking-widest"
                  >
                    Ver link de rastreio do cliente
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

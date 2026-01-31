import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  TrendingUp,
  Store,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { getStoreStatus } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const isStoreOpen = await getStoreStatus();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const salesToday = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startOfDay },
      status: { not: "CANCELADO" },
    },
  });

  const salesMonth = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startOfMonth },
      status: { not: "CANCELADO" },
    },
  });

  const formatMoney = (val: unknown) => {
    const numberValue = Number(val) || 0;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      numberValue,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />

      <div className="p-6 max-w-5xl mx-auto">
        {/* CABEÇALHO COM STATUS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 font-display">Visão Geral</h2>
            <p className="text-gray-500 text-sm">
              Acompanhe o desempenho do seu delivery
            </p>
          </div>

          {/* Status Card - Visual Rápido */}
          <div
            className={`px-4 py-2 rounded-lg flex items-center gap-3 border ${isStoreOpen ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
          >
            {isStoreOpen ? <Store size={20} /> : <Clock size={20} />}
            <div>
              <p className="text-xs font-bold uppercase opacity-70">Status da Loja</p>
              <p className="font-bold leading-none">
                {isStoreOpen ? "ABERTA" : "FECHADA"}
              </p>
            </div>
          </div>
        </div>

        {/* RELATÓRIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card: Hoje */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group">
            <div className="z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Vendas Hoje
              </p>
              <h3 className="text-3xl font-bold text-sushi-black">
                {formatMoney(salesToday._sum.total)}
              </h3>
              <div className="text-sm text-gray-400 mt-2 flex items-center gap-1 font-medium">
                <div className="bg-green-100 p-1 rounded text-green-700">
                  <TrendingUp size={14} />
                </div>
                {salesToday._count.id} pedidos
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-full text-green-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={32} />
            </div>
          </div>

          {/* Card: Mês */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group">
            <div className="z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Faturamento Mês
              </p>
              <h3 className="text-3xl font-bold text-sushi-black">
                {formatMoney(salesMonth._sum.total)}
              </h3>
              <div className="text-sm text-gray-400 mt-2 flex items-center gap-1 font-medium">
                <div className="bg-blue-100 p-1 rounded text-blue-700">
                  <ShoppingBag size={14} />
                </div>
                {salesMonth._count.id} pedidos
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">
          Acesso Rápido
        </h2>

        {/* MENU RÁPIDO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/pedidos" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-sushi-red hover:shadow-md transition-all flex items-center gap-4">
              <div className="bg-red-50 p-4 rounded-full text-sushi-red group-hover:scale-110 transition-transform shrink-0">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-sushi-red transition-colors">
                  Gerenciar Pedidos
                </h3>
                <p className="text-sm text-gray-500 leading-tight mt-1">
                  Ver fila e alterar status
                </p>
              </div>
            </div>
          </Link>

          <Link href="/admin/produtos" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-sushi-red hover:shadow-md transition-all flex items-center gap-4">
              <div className="bg-orange-50 p-4 rounded-full text-orange-600 group-hover:scale-110 transition-transform shrink-0">
                <UtensilsCrossed size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-sushi-red transition-colors">
                  Editar Cardápio
                </h3>
                <p className="text-sm text-gray-500 leading-tight mt-1">
                  Adicionar ou editar pratos
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

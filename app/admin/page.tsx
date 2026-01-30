import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { DollarSign, ShoppingBag, UtensilsCrossed, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Definição de Datas
  const now = new Date();

  // Início do Dia (Hoje 00:00)
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Início do Mês (Dia 1 00:00)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 2. Consultas ao Banco de Dados (Agregações)

  // Vendas do DIA
  const salesToday = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startOfDay },
      status: { not: "CANCELADO" }, // Ignora cancelados se houver essa lógica futura
    },
  });

  // Vendas do MÊS
  const salesMonth = await prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startOfMonth },
      status: { not: "CANCELADO" },
    },
  });

  // Função para formatar dinheiro
  const formatMoney = (val: number | null) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      val || 0,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">
          Visão Geral
        </h2>

        {/* --- AREA DE RELATÓRIOS (CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card: Hoje */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Vendas Hoje
              </p>
              <h3 className="text-3xl font-bold text-sushi-black mt-1">
                {formatMoney(salesToday._sum.total)}
              </h3>
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <ShoppingBag size={14} /> {salesToday._count.id} pedidos realizados
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full text-green-600">
              <TrendingUp size={32} />
            </div>
          </div>

          {/* Card: Mês */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Faturamento Mês
              </p>
              <h3 className="text-3xl font-bold text-sushi-black mt-1">
                {formatMoney(salesMonth._sum.total)}
              </h3>
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <ShoppingBag size={14} /> {salesMonth._count.id} pedidos no total
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Menu Rápido</h2>

        {/* --- MENU DE ACESSO RÁPIDO --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/pedidos" className="group">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-sushi-red hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
              <div className="bg-red-50 p-4 rounded-full text-sushi-red group-hover:scale-110 transition-transform">
                <ShoppingBag size={40} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Gerenciar Pedidos</h3>
                <p className="text-sm text-gray-500">
                  Ver pedidos recebidos e alterar status
                </p>
              </div>
            </div>
          </Link>

          <Link href="/admin/produtos" className="group">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-sushi-red hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
              <div className="bg-orange-50 p-4 rounded-full text-orange-600 group-hover:scale-110 transition-transform">
                <UtensilsCrossed size={40} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Editar Cardápio</h3>
                <p className="text-sm text-gray-500">
                  Adicionar, editar ou remover pratos
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

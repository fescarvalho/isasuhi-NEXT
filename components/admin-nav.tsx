"use client"; // Importante ser client

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  ClipboardList,
  LayoutDashboard,
  ExternalLink,
  Power,
} from "lucide-react";
import { toggleStoreOpen } from "@/app/actions";
// Precisamos saber se está aberta:
// Como AdminNav é Client Component, a melhor forma simples é passar via props ou usar um truque server action direto no form.
// Para simplificar: vou fazer um formulário que chama a action.

export function AdminNav({ isStoreOpen = true }: { isStoreOpen?: boolean }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm mb-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* LOGO + STATUS DA LOJA */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-sushi-black text-white p-2 rounded-lg">
              <UtensilsCrossed size={20} />
            </div>
            <h1 className="font-bold text-xl font-display text-gray-800">Painel</h1>
          </div>

          {/* BOTÃO DE ABRIR/FECHAR */}
          <form action={toggleStoreOpen}>
            <button
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                isStoreOpen
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200"
                  : "bg-red-100 text-red-700 border-red-200 hover:bg-green-100 hover:text-green-700 hover:border-green-200"
              }`}
              title="Clique para alterar"
            >
              <Power size={12} />
              {isStoreOpen ? "LOJA ABERTA" : "LOJA FECHADA"}
            </button>
          </form>
        </div>

        {/* MENU */}
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
          <Link
            href="/admin"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold ${pathname === "/admin" ? "bg-white shadow text-sushi-red" : "text-gray-500"}`}
          >
            <LayoutDashboard size={16} /> Visão
          </Link>
          <Link
            href="/admin/produtos"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold ${pathname.includes("/produtos") ? "bg-white shadow text-sushi-red" : "text-gray-500"}`}
          >
            <UtensilsCrossed size={16} /> Produtos
          </Link>
          <Link
            href="/admin/pedidos"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold ${pathname.includes("/pedidos") ? "bg-white shadow text-sushi-red" : "text-gray-500"}`}
          >
            <ClipboardList size={16} /> Pedidos
          </Link>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-sushi-red flex items-center gap-1 font-medium"
        >
          Ver Loja <ExternalLink size={14} />
        </Link>
      </div>
    </nav>
  );
}

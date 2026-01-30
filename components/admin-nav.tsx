"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  ClipboardList,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true;
    if (path !== "/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm mb-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-sushi-black text-white p-2 rounded-lg">
            <UtensilsCrossed size={20} />
          </div>
          <h1 className="font-bold text-xl font-display text-gray-800">Painel Admin</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
          <Link
            href="/admin"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${isActive("/admin") ? "bg-white shadow text-sushi-red" : "text-gray-500 hover:text-gray-900"}`}
          >
            <LayoutDashboard size={16} /> Visão Geral
          </Link>
          <Link
            href="/admin/produtos"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${isActive("/admin/produtos") ? "bg-white shadow text-sushi-red" : "text-gray-500 hover:text-gray-900"}`}
          >
            <UtensilsCrossed size={16} /> Produtos
          </Link>
          <Link
            href="/admin/pedidos"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${isActive("/admin/pedidos") ? "bg-white shadow text-sushi-red" : "text-gray-500 hover:text-gray-900"}`}
          >
            <ClipboardList size={16} /> Pedidos
          </Link>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-sushi-red flex items-center gap-1 font-medium hover:underline"
        >
          Ver Loja <ExternalLink size={14} />
        </Link>
      </div>
    </nav>
  );
}

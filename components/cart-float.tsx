"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, ChevronRight } from "lucide-react";

export function CartFloat() {
  const { cart, total, toggleCart } = useCartStore();

  if (cart.length === 0) return null;

  return (
    /* Alterado: de bottom-6 para top-4, e removido o preenchimento lateral total para fixar à direita */
    <div className="fixed top-4 right-4 z-50 pointer-events-none animate-fade-in">
      <button
        onClick={toggleCart}
        /* Alterado: removido w-full e max-w-md para que o botão tenha um tamanho compacto apenas para o conteúdo */
        className="group pointer-events-auto bg-sushi-darkRed text-white p-1.5 pr-3 rounded-full shadow-2xl flex items-center justify-between gap-3 hover:bg-black transition-all duration-300 active:scale-95 cursor-pointer ring-4 ring-white/20"
      >
        {/* Alterado: p-3 para p-2 para diminuir o círculo interno */}
        <div className="bg-white text-sushi-red p-2 rounded-full flex items-center gap-2 shadow-sm group-hover:scale-105 transition-transform">
          <ShoppingBag size={18} strokeWidth={2.5} />
          <span className="font-bold text-base">{cart.length}</span>
        </div>

        <div className="flex flex-col items-end mr-1">
          <span className="text-[10px] text-gray-300 uppercase font-semibold tracking-wider leading-tight">
            Ver sacola
          </span>
          <span className="font-bold text-sm font-display leading-none">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total())}
          </span>
        </div>

        <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
          <ChevronRight size={18} />
        </div>
      </button>
    </div>
  );
}

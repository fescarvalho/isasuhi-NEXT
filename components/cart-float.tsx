"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, ChevronRight } from "lucide-react";

export function CartFloat() {
  const { cart, total, toggleCart } = useCartStore();
  
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-40 pointer-events-none animate-fade-up">
      <button
        onClick={toggleCart}
        className="group pointer-events-auto w-full max-w-md mx-auto bg-sushi-darkRed text-white p-2 pr-4 rounded-full shadow-2xl flex items-center justify-between hover:bg-black transition-all duration-300 active:scale-95 cursor-pointer ring-4 ring-white/20"
      >
        {/* Ícone com contador */}
        <div className="bg-white text-sushi-red p-3 rounded-full flex items-center gap-2 shadow-sm group-hover:scale-105 transition-transform">
          <ShoppingBag size={20} strokeWidth={2.5} />
          <span className="font-bold text-lg">{cart.length}</span>
        </div>
        
        {/* Texto e Total */}
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs text-gray-300 uppercase font-semibold tracking-wider">Ver sacola</span>
          <span className="font-bold text-lg font-display leading-none">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total())}
          </span>
        </div>

        {/* Setinha animada */}
        <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
            <ChevronRight size={20} />
        </div>
      </button>
    </div>
  );
}
"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string | null;
  };
  isStoreOpen: boolean;
}

export function ProductCard({ product, isStoreOpen }: ProductProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!isStoreOpen) {
      toast.error("Loja Fechada", {
        description: "Não estamos aceitando pedidos no momento.",
      });
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    });

    toast.success(`${product.name} adicionado!`, {
      description: "Item salvo na sua sacola.",
      duration: 3000,
      icon: <ShoppingBag className="text-green-600" size={18} />,
      action: {
        label: "Ver Sacola",
        onClick: () => {
          const cartTrigger = document.querySelector('[data-cart-trigger]') as HTMLElement;
          if (cartTrigger) cartTrigger.click();
        },
      },
    });
  };

  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

      {/* Imagem */}
      <div className="h-52 w-full bg-gray-50 relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
            <ShoppingBag size={28} strokeWidth={1.5} className="mb-1.5 opacity-40" />
            <span className="text-[11px] text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-gray-800 font-bold text-[15px] font-display leading-snug group-hover:text-sushi-red transition-colors line-clamp-2 mb-1.5">
          {product.name}
        </h3>

        <p className="text-gray-400 text-[13px] leading-relaxed mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/80">
          <div className="text-sushi-darkRed text-lg font-bold font-display">
            {priceFormatted}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isStoreOpen}
            className={`px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-200 ${isStoreOpen
                ? "bg-sushi-red text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              }`}
            title={isStoreOpen ? "Adicionar à sacola" : "Loja Fechada"}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
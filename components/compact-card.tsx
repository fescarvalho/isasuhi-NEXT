"use client";

import { useCartStore } from "@/store/cart-store";
import { Plus } from "lucide-react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

export function CompactCard({ product }: ProductProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between items-center gap-3">
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-1">{product.description}</p>
        <div className="font-bold text-sushi-red text-sm">{priceFormatted}</div>
      </div>

      <button
        onClick={() => addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description
        })}
        className="bg-sushi-red text-white p-2 rounded-full shadow-md active:scale-90 transition-transform"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
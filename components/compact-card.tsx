"use client";

import { useCartStore } from "@/store/cart-store";
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

export function CompactCard({ product, isStoreOpen }: ProductProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3 h-28 hover:border-gray-200 transition-colors">
      {/* Foto */}
      {product.imageUrl && (
        <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-50 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}

      {/* Texto */}
      <div className="flex-1 h-full flex flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm mb-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 leading-tight">
            {product.description}
          </p>
        </div>
        <div className="font-bold text-sushi-red text-sm">{priceFormatted}</div>
      </div>

      {/* Botão */}
      <button
        onClick={() => {
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
            imageUrl: product.imageUrl || "",
          });
        }}
        disabled={!isStoreOpen}
        className={`text-[11px] font-semibold px-3 py-2 rounded-lg active:scale-95 transition-transform shrink-0 ${isStoreOpen
            ? "bg-sushi-red text-white hover:bg-red-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
          }`}
      >
        + Pedir
      </button>
    </div>
  );
}

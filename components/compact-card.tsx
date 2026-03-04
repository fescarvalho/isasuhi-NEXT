"use client";

import { useCartStore } from "@/store/cart-store";
import { Plus } from "lucide-react";
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
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3 h-28">
      {/* ✅ 1. ÁREA DA FOTO (NOVA) */}
      {product.imageUrl && (
        <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}

      {/* 2. TEXTO (Mantido, mas agora flexível) */}
      <div className="flex-1 h-full flex flex-col justify-between py-1">
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-tight">
            {product.description}
          </p>
        </div>
        <div className="font-bold text-sushi-red text-sm mt-1">{priceFormatted}</div>
      </div>

      {/* 3. BOTÃO (Mantido) */}
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
        className={`p-2.5 rounded-full shadow-md active:scale-90 transition-transform shrink-0 ${isStoreOpen
          ? "bg-sushi-red text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
          }`}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

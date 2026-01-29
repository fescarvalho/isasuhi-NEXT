"use client";

import { useCartStore } from "@/store/cart-store";
import { Plus } from "lucide-react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string | null;
  };
}

export function ProductCard({ product }: ProductProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Área da Imagem com Zoom no Hover */}
      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-sm">
            <span className="italic">Sem imagem</span>
          </div>
        )}
        
        {/* Gradiente sutil em cima da imagem para o texto contrastar se necessário */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-800 font-bold text-lg font-display leading-tight group-hover:text-sushi-red transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 font-sans">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-100">
          <div className="text-sushi-darkRed text-xl font-bold font-display">
            {priceFormatted}
          </div>

          <button
            onClick={() => addToCart({ 
              id: product.id, 
              name: product.name, 
              price: product.price, 
              description: product.description 
            })}
            className="bg-sushi-red text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-200"
            title="Adicionar ao carrinho"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
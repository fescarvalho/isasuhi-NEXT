"use client";

import { useCartStore } from "@/store/cart-store";
import { Plus, ShoppingBag } from "lucide-react";
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
}

export function ProductCard({ product }: ProductProps) {
  
  const addToCart = useCartStore((state) => state.addToCart); 

  
  const handleAddToCart = () => {
    
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      description: product.description,
    // imageUrl: product.imageUrl 
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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
  
      <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
            <ShoppingBag size={32} strokeWidth={1.5} className="mb-2 opacity-50"/>
            <span className="text-xs font-medium">Sem imagem</span>
          </div>
        )}
        
        {/* Gradiente para o texto brilhar mais */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-800 font-bold text-lg font-display leading-tight group-hover:text-sushi-red transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 font-sans line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-100">
          <div className="text-sushi-darkRed text-xl font-bold font-display">
            {priceFormatted}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-sushi-red text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-200"
            title="Adicionar à sacola"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
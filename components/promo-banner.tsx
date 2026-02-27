"use client";

import { useCartStore } from "@/store/cart-store";
import { Plus, ShoppingBag, Flame } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PromoBannerProps {
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        imageUrl?: string | null;
    };
}

export function PromoBanner({ product }: PromoBannerProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
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
        <div
            onClick={handleAddToCart}
            className="group relative w-full bg-gray-900 rounded-[24px] md:rounded-[32px] overflow-hidden mb-12 cursor-pointer transition-all duration-500 ring-4 ring-sushi-red/20 shadow-[0_0_60px_-10px_rgba(239,68,68,0.7)] hover:shadow-[0_0_80px_-5px_rgba(239,68,68,0.8)]"
        >
            {/* Image Wrapper */}
            {product.imageUrl ? (
                <div className="w-full relative aspect-[16/6] md:aspect-[21/9] overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover opacity-100 group-hover:scale-[1.01] transition-transform duration-700"
                        sizes="100vw"
                    />
                </div>
            ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-800">
                    <ShoppingBag size={48} className="text-gray-700 opacity-20" />
                </div>
            )}

            {/* Price and Button - Floating together */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 flex items-center justify-end gap-2 md:gap-3 bg-gradient-to-t from-black/60 to-transparent">
                {/* Floating Price */}
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-white/10 shadow-lg italic">
                    <span className="text-white font-black text-sm md:text-2xl tracking-tighter">
                        {priceFormatted}
                    </span>
                </div>

                {/* Floating Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                    }}
                    className="bg-sushi-red text-white px-4 py-2 md:px-7 md:py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-sm flex items-center gap-2 hover:bg-white hover:text-sushi-red transition-all transform active:scale-95 shadow-xl border border-white/10"
                >
                    COMPRAR
                    <Plus size={14} className="md:w-5 md:h-5" strokeWidth={4} />
                </button>
            </div>
        </div>
    );
}

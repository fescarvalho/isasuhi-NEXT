"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import { CompactCard } from "./compact-card";
import { PromoBanner } from "./promo-banner";
import { Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
  isBanner: boolean;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface MenuInterfaceProps {
  categories: Category[];
}

export function MenuInterface({ categories }: MenuInterfaceProps) {
  const [activeTab, setActiveTab] = useState<string>("Destaques");
  const activeCategoryData = categories.find((cat) => cat.name === activeTab);

  const allProducts = categories.flatMap((cat) => cat.products);

  // ============================================================
  // 🚀 BANNER PROMOCIONAL: PEGA O PRIMEIRO MARCADO COMO BANNER
  // ============================================================
  const bannerProduct = allProducts.find((p) => p.isBanner === true);

  // ============================================================
  // 🚀 NOVA LÓGICA DINÂMICA: FILTRA PELO CAMPO 'isFeatured'
  // ============================================================
  const highlights = allProducts
    .filter((p) => p.isFeatured === true) // Filtra o que você marcou no banco
    .slice(0, 6);

  return (
    <div>
      {/* --- MENU DE NAVEGAÇÃO --- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm pt-4 pb-4 mb-8">
        <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar md:justify-center justify-start items-center">
          <button
            onClick={() => setActiveTab("Destaques")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 transform ${activeTab === "Destaques"
                ? "bg-sushi-darkRed text-white shadow-lg scale-105 ring-2 ring-red-100"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
              }`}
          >
            <Flame
              size={18}
              className={activeTab === "Destaques" ? "text-orange-400 animate-pulse" : ""}
              fill={activeTab === "Destaques" ? "currentColor" : "none"}
            />
            Destaques
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.name)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${activeTab === category.name
                  ? "bg-sushi-red text-white shadow-lg scale-105"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-32 animate-fade-up max-w-5xl mx-auto min-h-[60vh]">
        {activeTab === "Destaques" && (
          <div>
            {/* RENDERIZA O BANNER SE HOUVER UM PRODUTO MARCADO */}
            {bannerProduct && (
              <PromoBanner
                product={{
                  ...bannerProduct,
                  price: Number(bannerProduct.price),
                  description: bannerProduct.description || "",
                }}
              />
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-full">
                <Flame className="text-orange-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-display">
                Os Mais Pedidos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.length > 0 ? (
                highlights.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      description: product.description || "",
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-400">
                    Marque alguns produtos como Destaque no seu painel administrativo.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== "Destaques" && activeCategoryData && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-display mb-6 pl-2 border-l-4 border-sushi-red">
              {activeCategoryData.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCategoryData.products.map((product) => (
                <CompactCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    description: product.description || "",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

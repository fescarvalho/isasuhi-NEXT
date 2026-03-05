"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
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
  isStoreOpen: boolean;
}

export function MenuInterface({ categories, isStoreOpen }: MenuInterfaceProps) {
  const [activeTab, setActiveTab] = useState<string>("Destaques");
  const activeCategoryData = categories.find((cat) => cat.name === activeTab);

  const allProducts = categories.flatMap((cat) => cat.products);

  const bannerProduct = allProducts.find((p) => p.isBanner === true);

  const highlights = allProducts
    .filter((p) => p.isFeatured === true)
    .slice(0, 6);

  return (
    <div>
      {/* --- NAVEGAÇÃO COM UNDERLINE --- */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-gray-200/50 pt-2 pb-0 mb-8">
        <div className="flex overflow-x-auto gap-1 px-4 no-scrollbar md:justify-center justify-start items-end">
          <button
            onClick={() => setActiveTab("Destaques")}
            className={`relative flex items-center gap-1.5 px-4 py-3 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${activeTab === "Destaques"
              ? "text-sushi-red"
              : "text-gray-400 hover:text-gray-700"
              }`}
          >
            <Flame
              size={16}
              className={activeTab === "Destaques" ? "text-orange-500" : ""}
              fill={activeTab === "Destaques" ? "currentColor" : "none"}
            />
            Destaques
            {activeTab === "Destaques" && (
              <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-sushi-red rounded-full tab-underline" />
            )}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.name)}
              className={`relative px-4 py-3 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${activeTab === category.name
                ? "text-sushi-red"
                : "text-gray-400 hover:text-gray-700"
                }`}
            >
              {category.name}
              {activeTab === category.name && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-sushi-red rounded-full tab-underline" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-32 animate-fade-up max-w-5xl mx-auto min-h-[60vh]">
        {activeTab === "Destaques" && (
          <div>
            {bannerProduct && (
              <PromoBanner
                product={{
                  ...bannerProduct,
                  price: Number(bannerProduct.price),
                  description: bannerProduct.description || "",
                }}
                isStoreOpen={isStoreOpen}
              />
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <Flame className="text-white" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-display">
                Os Mais Pedidos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {highlights.length > 0 ? (
                highlights.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      description: product.description || "",
                    }}
                    isStoreOpen={isStoreOpen}
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
            <h2 className="text-2xl font-bold text-gray-800 font-display mb-6 pl-3 border-l-[3px] border-sushi-red">
              {activeCategoryData.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCategoryData.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    description: product.description || "",
                  }}
                  isStoreOpen={isStoreOpen}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

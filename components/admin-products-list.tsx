"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Search, Image as ImageIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  categoryId: string;
  isFeatured?: boolean; // Adicionei caso venha do banco
}

interface Category {
  id: string;
  name: string;
}

interface AdminProductsListProps {
  products: Product[];
  categories: Category[];
}

export function AdminProductsList({ products, categories }: AdminProductsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra produtos pelo nome ou ID
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* --- BARRA DE TOPO: BUSCA E BOTÃO NOVO --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sushi-red focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          href="/admin/produtos/novo"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Novo Produto
        </Link>
      </div>

      {/* --- LISTA DE PRODUTOS --- */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-orange-200 hover:shadow-md transition-all group"
          >
            {/* 1. FOTO PEQUENA (Quadrada e fixa) */}
            <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <ImageIcon className="text-gray-300" size={24} />
              )}
            </div>

            {/* 2. CONTEÚDO (Com proteção min-w-0 para não estourar) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 text-base truncate pr-2">
                  {product.name}
                </h3>
                {product.isFeatured && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                    ★ Destaque
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 truncate mb-1">
                {product.description || "Sem descrição"}
              </p>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-sushi-red">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </span>

                {/* --- AQUI ESTÁ A CORREÇÃO DO LAYOUT NO MOBILE --- */}
                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded truncate max-w-[80px] md:max-w-xs font-mono">
                  ID: {product.id}
                </span>
              </div>
            </div>

            {/* 3. BOTÃO EDITAR */}
            <Link
              href={`/admin/produtos/${product.id}`}
              className="p-3 bg-gray-50 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors shrink-0"
            >
              <Pencil size={20} />
            </Link>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

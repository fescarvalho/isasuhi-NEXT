"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { deleteProduct } from "@/app/actions";

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export function AdminProductsList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de Filtragem: Categoria + Busca por texto
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "TODOS" || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* --- BARRA DE FERRAMENTAS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Filtros de Categoria (Scroll Lateral no celular) */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory("TODOS")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === "TODOS"
                ? "bg-sushi-black text-white"
                : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-sushi-black text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Botão Novo + Busca */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sushi-red/20"
            />
          </div>
          <button className="bg-sushi-red text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm whitespace-nowrap hover:bg-red-700 transition-colors">
            <Plus size={18} /> <span className="hidden sm:inline">Novo</span>
          </button>
        </div>
      </div>

      {/* --- LISTA DE PRODUTOS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border-b last:border-0 flex justify-between items-center hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p className="font-bold text-gray-800">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sushi-red font-bold text-sm">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wide">
                    {product.category.name}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {/* Botão Editar */}
                <button
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>

                {/* Botão Deletar */}
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </p>
    </div>
  );
}

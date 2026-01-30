import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { CartSidebar } from "@/components/cart-sidebar";
import { getStoreStatus } from "@/app/actions";
import { Clock, MapPin, Store } from "lucide-react";

// --- MÁGICA AQUI: OBRIGA A PÁGINA A ATUALIZAR SEMPRE ---
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Busca o status atualizado
  const isStoreOpen = await getStoreStatus();

  // Se quiser testar, pode olhar no terminal do VSCode se aparece true ou false
  console.log("Status da Loja na Home:", isStoreOpen);

  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* BANNER DE AVISO - SÓ APARECE SE FECHADO (!isStoreOpen) */}
      {!isStoreOpen && (
        <div className="bg-red-600 text-white p-4 text-center sticky top-0 z-50 shadow-lg flex flex-col items-center justify-center animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Store size={24} /> LOJA FECHADA
          </div>
          <p className="text-sm opacity-90 mt-1 font-medium">
            Não estamos aceitando novos pedidos no momento.
          </p>
        </div>
      )}

      {/* Hero / Header */}
      <header className="bg-white p-6 shadow-sm mb-6 relative z-10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="bg-sushi-red w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            IS
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-800">
              Isa Sushi 🍣
            </h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin size={14} /> <span>Entregamos em toda região</span>
            </div>

            {/* Badge de Status no Header */}
            <div
              className={`flex items-center gap-1 text-xs font-bold mt-2 px-2 py-1 rounded w-fit transition-colors ${isStoreOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              <Clock size={12} />
              {isStoreOpen ? "ABERTO AGORA" : "FECHADO"}
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Produtos */}
      <main className="max-w-md mx-auto px-4 space-y-10">
        {categories.map(
          (category) =>
            category.products.length > 0 && (
              <section key={category.id} id={category.name}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-sushi-red pl-3 font-display">
                  {category.name}
                </h2>
                <div className="space-y-4">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        price: product.price.toNumber(),
                        description: product.description || "",
                      }}
                    />
                  ))}
                </div>
              </section>
            ),
        )}
      </main>

      <CartSidebar />
    </div>
  );
}

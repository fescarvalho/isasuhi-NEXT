import { prisma } from "@/lib/prisma";
import { AdminProductsList } from "@/components/admin-products-list";
import { AdminNav } from "@/components/admin-nav";
import { getStoreStatus } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // 1. Busca os Produtos
  const rawProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  // Converte o preço Decimal -> Number
  const products = rawProducts.map((product: any) => ({
    ...product,
    price: product.price.toNumber(),
    description: product.description || "",
    imageUrl: product.imageUrl || null,
  }));

  // 2. Busca as Categorias (NOVAS LINHAS)
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" }, // ou name: 'asc' se não tiver o campo order
  });

  const isStoreOpen = await getStoreStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-display">Cardápio</h1>
            <p className="text-gray-500">Gerencie seus produtos, preços e fotos.</p>
          </div>
        </div>

        {/* Passamos products E categories agora */}
        <AdminProductsList products={products} categories={categories} />
      </div>
    </div>
  );
}

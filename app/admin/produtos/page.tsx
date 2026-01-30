import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductsList } from "@/components/admin-products-list";
import { getStoreStatus } from "@/app/actions";
export default async function AdminProductsPage() {

  const rawProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  });
  const isStoreOpen = await getStoreStatus();
 
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });


  const products = rawProducts.map((product) => ({
    ...product,
    price: product.price.toNumber(), 
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />

      <div className="p-6 max-w-5xl mx-auto pb-20">
        <h2 className="text-2xl font-bold font-display text-gray-800 mb-6">
          Gestão de Cardápio
        </h2>

 
        <AdminProductsList products={products} categories={categories} />
      </div>
    </div>
  );
}

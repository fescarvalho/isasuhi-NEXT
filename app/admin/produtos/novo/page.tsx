import { ProductForm } from "@/components/product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      {/* Usa o componente corrigido, não um form manual */}
      <ProductForm categories={categories} isNew={true} />
    </div>
  );
}

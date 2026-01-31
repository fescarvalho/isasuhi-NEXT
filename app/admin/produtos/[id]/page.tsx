import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const rawProduct = await prisma.product.findUnique({ where: { id } });
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  if (!rawProduct) return notFound();

  // Conversão obrigatória de Decimal para Number
  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
    description: rawProduct.description || "",
    imageUrl: rawProduct.imageUrl || null,
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm
        key={product.id}
        product={product}
        categories={categories}
        isNew={false}
      />
    </div>
  );
}

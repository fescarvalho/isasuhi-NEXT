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

  // ✅ CONVERSÃO: Transforma Decimal em Number para o Frontend
  const product = {
    ...rawProduct,
    price: Number(rawProduct.price), // Converte o Decimal do Prisma para number
    description: rawProduct.description || "",
    imageUrl: rawProduct.imageUrl || null,
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <ProductForm
        key={product.id} // Reinicia o estado do form ao mudar de produto
        product={product}
        categories={categories}
        isNew={false}
      />
    </div>
  );
}

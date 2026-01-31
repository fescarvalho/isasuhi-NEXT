import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  // Busca o produto e as categorias
  const product = await prisma.product.findUnique({ where: { id } });
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/admin/produtos"
          className="flex items-center text-gray-500 hover:text-gray-800 mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Editar Produto</h1>
      </div>

      {/* ✅ CORREÇÃO: Passando isNew={false} para indicar que é uma edição */}
      <ProductForm
        key={product.id}
        product={product}
        categories={categories}
        isNew={false}
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form"; // Importa o form que acabamos de criar
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/admin/produtos"
          className="flex items-center text-gray-500 hover:text-gray-800 mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Novo Produto</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

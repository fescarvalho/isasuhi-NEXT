import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form"; // ✅ Usa o componente corrigido
import { getStoreStatus } from "@/app/actions";
import { AdminNav } from "@/components/admin-nav";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductFormPage({ params }: Props) {
  const { id } = await params;
  const isStoreOpen = await getStoreStatus();

  // Verifica se é criação de novo produto
  const isNew = id === "novo" || id === "new";

  // Busca dados (se não for novo)
  const rawProduct = !isNew ? await prisma.product.findUnique({ where: { id } }) : null;

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  // Se tentou editar um ID que não existe, dá erro 404
  if (!isNew && !rawProduct) {
    return notFound();
  }

  // ✅ CONVERSÃO OBRIGATÓRIA (Decimal -> Number)
  // Prepara o objeto para o componente Cliente
  const product = rawProduct
    ? {
      ...rawProduct,
      price: Number(rawProduct.price),
      description: rawProduct.description || "",
      imageUrl: rawProduct.imageUrl || null,
    }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav isStoreOpen={isStoreOpen} />

      <div className="p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <Link
              href="/admin/produtos"
              className="flex items-center text-gray-500 hover:text-gray-800 mb-2 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Voltar para a Lista
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 font-display">
              {isNew ? "Novo Produto" : "Editar Produto"}
            </h1>
          </div>

          {/* ✅ AQUI ESTÁ A CORREÇÃO:
             Em vez de escrever <form> aqui, chamamos o componente <ProductForm />
             que já tem a lógica de Toast e tratamento de erro correta.
          */}
          <ProductForm
            key={product?.id || "new"}
            product={product}
            categories={categories}
            isNew={isNew}
          />
        </div>
      </div>
    </div>
  );
}

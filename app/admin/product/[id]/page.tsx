// app/admin/product/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { saveProduct } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>; // Atualizado para Next.js 15 (params é Promise)
}

export default async function ProductFormPage({ params }: Props) {
  // Em Next.js 15, params deve ser aguardado
  const { id } = await params;

  const isNew = id === "new";

  // Busca o produto se for edição
  const product = !isNew ? await prisma.product.findUnique({ where: { id } }) : null;

  // Busca categorias para o select
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Link
            href="/admin"
            className="flex items-center text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            {isNew ? "Novo Produto" : "Editar Produto"}
          </h1>
        </div>

        <form
          action={saveProduct}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
        >
          {/* ID Oculto (se for edição) */}
          {!isNew && <input type="hidden" name="id" value={product?.id} />}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto
            </label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Combo Família"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              defaultValue={product?.description || ""}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 10 hots, 5 sashimis..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price ? Number(product.price) : ""}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="categoryId"
                defaultValue={product?.categoryId}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL da Imagem (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              name="imageUrl"
              defaultValue={product?.imageUrl || ""}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Cole um link de imagem ou deixe em branco.
            </p>
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2 mt-4"
          >
            <Save size={20} />
            {isNew ? "Cadastrar Produto" : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}

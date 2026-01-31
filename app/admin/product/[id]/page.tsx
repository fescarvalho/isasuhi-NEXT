import { prisma } from "@/lib/prisma";
import { saveProduct, getStoreStatus } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AdminNav } from "@/components/admin-nav"; // <--- Importe o menu

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductFormPage({ params }: Props) {
  const { id } = await params;

  const isStoreOpen = await getStoreStatus();

  const isNew = id === "new";

  const product = !isNew ? await prisma.product.findUnique({ where: { id } }) : null;

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

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

          <form
            action={saveProduct}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
          >
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
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red outline-none transition-all"
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
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red outline-none transition-all"
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red outline-none transition-all"
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red outline-none bg-white transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                name="imageUrl"
                defaultValue={product?.imageUrl || ""}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red outline-none transition-all"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Cole um link de imagem ou deixe em branco.
              </p>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2 mt-4 shadow-lg shadow-green-100"
            >
              <Save size={20} />
              {isNew ? "Cadastrar Produto" : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

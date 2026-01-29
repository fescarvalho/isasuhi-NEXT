// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProduct } from "@/app/actions";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { category: { order: "asc" } },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="flex items-center text-gray-500 hover:text-red-600 mb-2">
              <ArrowLeft size={16} className="mr-1" /> Voltar ao Site
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          </div>
          <Link
            href="/admin/product/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 font-bold"
          >
            <Plus size={20} /> Novo Produto
          </Link>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {product.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(product.price))}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Link
                      href={`/admin/product/${product.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </Link>
                    
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md" 
                        title="Excluir"
                        type="submit"
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
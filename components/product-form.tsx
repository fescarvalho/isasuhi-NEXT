"use client";

import { useState } from "react"; // Removido o useEffect
import { saveProduct } from "@/app/actions";
import { ImageUpload } from "@/components/image-upload";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | Decimal;
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
}

interface ProductFormProps {
  product?: Product; // Em vez de any
  categories: Category[]; // Em vez de any[]
  isNew: boolean;
}

export function ProductForm({ product, categories, isNew }: ProductFormProps) {
  // ✅ O estado é inicializado apenas uma vez aqui
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const router = useRouter();

  // Função que lida com o envio do formulário sem retornar valor para o HTML
  async function handleAction(formData: FormData) {
    try {
      const result = await saveProduct(formData);

      if (result?.success) {
        toast.success(isNew ? "Produto criado!" : "Produto atualizado!");
        setTimeout(() => {
          router.push("/admin/produtos");
          router.refresh();
        }, 1000);
      } else {
        toast.error("Houve um problema ao salvar.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro crítico no sistema.");
    }
  }

  return (
    <form
      action={handleAction} // ✅ Usa a função interna para evitar erros de tipo
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6"
    >
      {!isNew && <input type="hidden" name="id" value={product?.id} />}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Foto do Prato
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setImageUrl(url)}
          onRemove={() => setImageUrl("")}
        />
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            name="name"
            defaultValue={product?.name || ""}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              // ✅ Converte Decimal para Number com segurança
              defaultValue={product?.price ? Number(product.price) : ""}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId || ""}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red outline-none bg-white"
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            defaultValue={product?.description || ""}
            rows={3}
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-sushi-red outline-none"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 transition-all hover:bg-orange-100/50">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              defaultChecked={!!product?.isFeatured}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-orange-500 checked:bg-orange-500 focus:outline-none transition-all"
            />
            <svg
              className="absolute h-3.5 w-3.5 pointer-events-none hidden peer-checked:block stroke-white mt-1 ml-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label
            htmlFor="isFeatured"
            className="text-sm font-bold text-gray-700 cursor-pointer select-none"
          >
            🌟 Exibir em Os Mais Pedidos (Destaques)
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition flex justify-center items-center gap-2"
      >
        <Save size={20} />
        {isNew ? "Cadastrar Produto" : "Salvar Alterações"}
      </button>
    </form>
  );
}

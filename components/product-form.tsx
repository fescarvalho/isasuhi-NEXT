"use client";

import { useState } from "react";
import { saveProduct } from "@/app/actions";
import { ImageUpload } from "@/components/image-upload";
import { Save, Star, Flame } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- TIPAGEM RIGOROSA PARA EVITAR ERROS DE BUILD ---
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // O pai deve converter Decimal -> Number antes de enviar pra cá
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
  isBanner: boolean;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isNew: boolean;
}

export function ProductForm({ product, categories, isNew }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(product?.imageUrl || "");
  const router = useRouter();

  // --- AQUI ESTÁ A MÁGICA ---
  // Esta função chama a Server Action, consome o retorno,
  // mas ELA MESMA não retorna nada (void), satisfazendo o <form>
  async function handleAction(formData: FormData) {
    try {
      const result = await saveProduct(formData);

      if (result?.success) {
        toast.success(isNew ? "Produto criado!" : "Produto atualizado!");
        // Pequeno delay para o usuário ler o toast antes de sair
        setTimeout(() => {
          router.push("/admin/produtos");
          router.refresh();
        }, 500);
      } else {
        toast.error(result?.error || "Houve um problema ao salvar.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro crítico no sistema.");
    }
  }

  return (
    <form
      action={handleAction} // 👈 AQUI! Use handleAction, NÃO saveProduct
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6"
    >
      {!isNew && <input type="hidden" name="id" value={product?.id} />}

      {/* --- UPLOAD DE IMAGEM --- */}
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

      {/* --- CAMPOS --- */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            name="name"
            defaultValue={product?.name || ""}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red outline-none"
            placeholder="Ex: Combo Família"
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
              defaultValue={product?.price || ""}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sushi-red outline-none"
              placeholder="0.00"
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

        {/* --- DESTAQUE --- */}
        <div className="flex flex-col gap-4">
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
              className="text-sm font-bold text-gray-700 cursor-pointer select-none flex items-center gap-2"
            >
              <Star size={16} className="text-orange-500 fill-orange-500" />
              Exibir em Os Mais Pedidos (Destaques)
            </label>
          </div>

          {/* --- BANNER --- */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:bg-blue-100/50">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="isBanner"
                name="isBanner"
                defaultChecked={!!product?.isBanner}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-blue-500 checked:bg-blue-500 focus:outline-none transition-all"
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
              htmlFor="isBanner"
              className="text-sm font-bold text-gray-700 cursor-pointer select-none flex items-center gap-2"
            >
              <Flame size={16} className="text-blue-500 fill-blue-500" />
              Exibir como Banner Promocional no Topo
            </label>
          </div>
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

"use client";

import { useState } from "react";
import { saveProduct } from "@/app/actions";
import { ImageUpload } from "@/components/image-upload";
import { Save, Star } from "lucide-react"; // Adicionei o ícone Star para o destaque
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

// ✅ Definição exata do Produto (usando number para o preço)
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // No frontend, trabalhamos apenas com number
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
}

interface ProductFormProps {
  product?: Product; // Propriedade opcional para o modo "Novo"
  categories: Category[]; // Array de categorias tipado
  isNew: boolean;
}
export function ProductForm({ product, categories, isNew }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  async function handleAction(formData: FormData) {
    try {
      await saveProduct(formData);
      toast.success(isNew ? "Produto criado!" : "Produto atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto.");
    }
  }

  return (
    <form
      action={handleAction}
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

      {/* Campos de Texto */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            name="name"
            defaultValue={product?.name}
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
            defaultValue={product?.price || ""}
            rows={3}
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-sushi-red outline-none"
          />
        </div>

        {/* --- ✅ CAMPO DE DESTAQUE (ADICIONADO AQUI) --- */}
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            // Se for edição (!isNew), ele já vem marcado ou desmarcado conforme o banco
            defaultChecked={product?.isFeatured}
            className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2"
          >
            <Star size={16} className="text-orange-500 fill-orange-500" />
            Exibir em Os Mais Pedidos (Destaques)
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

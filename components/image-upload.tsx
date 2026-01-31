"use client";

import { UploadDropzone } from "@/lib/uploadthing"; // Verifique se o caminho está certo
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  // Se JÁ TEM uma imagem (ex: edição), mostra a foto com botão de excluir
  if (value) {
    return (
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={() => onRemove(value)}
            className="bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <Image fill src={value} alt="Imagem do produto" className="object-cover" />
      </div>
    );
  }

  // Se NÃO tem imagem, mostra a caixa de upload
  return (
    <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // O upload terminou! Pegamos a URL da primeira imagem
          const url = res[0].url;
          onChange(url);
          toast.success("Imagem enviada com sucesso!");
        }}
        onUploadError={(error: Error) => {
          toast.error(`Erro: ${error.message}`);
        }}
        appearance={{
          button: "bg-sushi-red text-white hover:bg-red-700 text-sm", // Estilizando o botão
          container: "w-full h-48 border-0 bg-transparent",
          label: "text-sushi-red hover:text-red-700",
        }}
      />
    </div>
  );
}

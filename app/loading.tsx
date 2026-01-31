import Image from "next/image";

export default function Loading() {
  return (
    // ✅ CORREÇÃO: usei z-[9999] para garantir que fique no topo de tudo
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* 1. O ANEL GIRATÓRIO (Loader) */}
        <div className="absolute w-40 h-40 rounded-full border-4 border-gray-100 border-t-[#E63946] animate-spin"></div>

        {/* 2. A SUA LOGO CENTRAL (Estática) */}
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden p-2">
          {/* Adicionei p-2 para dar um respiro entre a logo e a borda */}
          <Image
            src="/logo.png" // ⚠️ IMPORTANTE: Garanta que sua logo esteja em "public/logo.png"
            alt="Carregando Isa Sushi..."
            width={120}
            height={120}
            className="object-contain"
            priority // Carrega a imagem instantaneamente
          />
        </div>
      </div>

      {/* Texto pulsando */}
      <div className="absolute mt-48 text-gray-400 text-xs font-bold tracking-widest uppercase animate-pulse">
        Carregando...
      </div>
    </div>
  );
}

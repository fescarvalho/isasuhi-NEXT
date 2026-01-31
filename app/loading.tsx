import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* 1. O ANEL GIRATÓRIO (Loader) 
            - animate-spin: Faz girar
            - border-t-sushi-red: A parte vermelha que gira (topo)
            - border-gray-100: O fundo do anel
        */}
        <div className="absolute w-40 h-40 rounded-full border-4 border-gray-100 border-t-[#E63946] animate-spin"></div>

        {/* 2. A SUA LOGO CENTRAL (Estática) 
            - bg-white: Fundo branco para limpar o visual
            - shadow-sm: Uma sombra leve para dar profundidade
        */}
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden p-1">
          <Image
            src="/logo.png" // Certifique-se que a imagem está na pasta public com este nome
            alt="Carregando Isa Sushi..."
            width={120}
            height={120}
            className="object-contain"
            priority // Carrega a imagem imediatamente
          />
        </div>
      </div>

      {/* Texto opcional abaixo (se quiser remover, apague essa div) */}
      <div className="absolute mt-48 text-gray-400 text-xs font-bold tracking-widest uppercase animate-pulse">
        Carregando...
      </div>
    </div>
  );
}

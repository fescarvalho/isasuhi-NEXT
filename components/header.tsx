import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center pt-8 pb-4 px-4 text-center">
      {/* AUMENTANDO O TAMANHO AQUI:
         w-64 (256px) -> w-80 (320px) ou w-96 (384px)
         h-32 (128px) -> h-40 (160px) ou h-48 (192px)
         
         Mantenha a proporção para a imagem não cortar!
      */}
      <div className="relative w-124 h-62 mb-4">
        <Image 
          src="/logo.png" 
          alt="Isa Sushi Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Se não quiser o texto embaixo, pode remover este <p> */}
      <p className="text-gray-500 italic font-display text-sm">
        O melhor da culinária japonesa oriental
      </p>
    </header>
  );
}
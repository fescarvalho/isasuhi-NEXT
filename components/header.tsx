import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center pt-8 pb-4 px-4 text-center">
      {/* CORREÇÃO AQUI: 
          - w-64 (256px): Tamanho padrão para celular
          - md:w-80: Aumenta para 320px em telas maiores
          - max-w-full: Garante que nunca ultrapasse a largura da tela 
      */}
      <div className="relative w-[300px] md:w-[400px] h-[200px] md:h-[250px] mb-4 max-w-full">
        <Image 
          src="/logo.png" 
          alt="Isa Sushi Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <p className="text-gray-500 italic font-display text-sm">
        O melhor da culinária japonesa oriental
      </p>
    </header>
  );
}

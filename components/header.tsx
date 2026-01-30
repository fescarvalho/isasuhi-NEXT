import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center pt-8 pb-4 px-4 text-center">
   
      <div className="relative w-[300px] md:w-[400px] h-[200px] md:h-[250px] mb-4 max-w-full">
        <Image 
          src="/logo.png" 
          alt="Isa Sushi Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <p className="text-gray-500 italic font-display text-1xl">
        O melhor da culinária japonesa oriental
      </p>

      <div className="bg-yellow-100 text-yellow-800 text-xs mt-3 font-bold text-center py-2 px-4">
       ⚠️ Aceitamos encomendas a semana toda! Entregas apenas na SEXTA-FEIRA.
      </div>
    </header>
  );
}

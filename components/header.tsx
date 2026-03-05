import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center pt-10 pb-6 px-4 text-center">

      <div className="relative w-[380px] md:w-[500px] h-[240px] md:h-[320px] mb-3 max-w-full">
        <Image
          src="/logo-transparente.png"
          alt="Isa Sushi Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <p className="text-gray-400 font-display italic text-lg md:text-xl tracking-wide">
        O melhor da culinária japonesa oriental
      </p>

      <div className="mt-4 bg-amber-50 text-amber-800 text-xs font-semibold text-center py-2.5 px-5 rounded-lg border border-amber-200/60">
        ⚠️ Aceitamos encomendas a semana toda! Entregas apenas na <strong>SEXTA-FEIRA</strong>.
      </div>
      <div className="bg-red-50 text-red-700 text-[11px] mt-2 font-semibold text-center py-2 px-4 rounded-lg border border-red-100">
        📍 Entregas apenas na cidade de Natividade-RJ.
      </div>
    </header>
  );
}

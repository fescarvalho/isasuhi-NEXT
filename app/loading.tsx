import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F5]/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Carregando Isa Sushi..."
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-sushi-red/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-sushi-red/40 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-1.5 h-1.5 bg-sushi-red/40 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}

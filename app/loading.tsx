import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-52 w-52 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-sushi-red border-t-transparent" />
          <Image
            src="/logo-transparente.png"
            alt="Carregando Isa Sushi..."
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

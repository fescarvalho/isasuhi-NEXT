"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Define o tempo que a tela vai ficar visível (2000ms = 2 segundos)
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Se o tempo acabou, não renderiza nada (libera a tela)
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="relative flex items-center justify-center animate-in fade-in zoom-in duration-500">
        {/* 1. O ANEL GIRATÓRIO */}
        <div className="absolute w-40 h-40 rounded-full border-4 border-gray-100 border-t-[#E63946] animate-spin"></div>

        {/* 2. A LOGO */}
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm p-2">
          <Image
            src="/logo.png"
            alt="Carregando..."
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

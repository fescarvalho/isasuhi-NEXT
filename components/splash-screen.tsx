"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 800);
    const hideTimer = setTimeout(() => setShow(false), 1100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed left-0 top-0 flex h-[100dvh] w-screen items-center justify-center bg-white transition-all duration-400 ${fade ? "opacity-0 pointer-events-none -z-10" : "opacity-100 z-[9999]"
        }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-64 w-64 items-center justify-center animate-appear">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-sushi-red border-t-transparent" />
          <Image
            src="/logo-transparente.png"
            alt="Isa Sushi"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

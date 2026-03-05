"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 1400);
    const hideTimer = setTimeout(() => setShow(false), 1800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F5] transition-opacity duration-400 ${fade ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 flex items-center justify-center animate-appear">
          <Image
            src="/logo.png"
            alt="Isa Sushi"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>
        <div className="h-0.5 w-12 bg-sushi-red/30 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

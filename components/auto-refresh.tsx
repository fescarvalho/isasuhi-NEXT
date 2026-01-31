"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 1. Defina a interface para aceitar o intervalo
interface AutoRefreshProps {
  interval?: number; // O sinal de '?' torna a prop opcional
}

export function AutoRefresh({ interval = 10000 }: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    // 2. Use o valor da prop no setInterval
    const timer = setInterval(() => {
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}

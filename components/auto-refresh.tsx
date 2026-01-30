"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Atualiza a página a cada 30 segundos
    const interval = setInterval(() => {
      router.refresh();
      console.log("Admin atualizado!"); // Só pra você saber que está rodando
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  return null; // Esse componente não mostra nada na tela, só age nos bastidores
}

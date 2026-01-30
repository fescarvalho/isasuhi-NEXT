"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    
    const interval = setInterval(() => {
      router.refresh();
      console.log("Admin atualizado!"); 
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  return null; 
}

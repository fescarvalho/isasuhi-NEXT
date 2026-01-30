import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { CartFloat } from "@/components/cart-float";
import { CartSidebar } from "@/components/cart-sidebar";
import { MenuInterface } from "@/components/menu-interface";
import { Footer } from "@/components/footer";
import { getStoreStatus } from "@/app/actions"; //
import { Store } from "lucide-react";

export const dynamic = "force-dynamic"; //

async function getMenu() {
  const categories = await prisma.category.findMany({
    include: { products: true },
    orderBy: { order: "asc" },
  });
  return categories;
}

export default async function Home() {
  const isStoreOpen = await getStoreStatus(); //
  const categories = await getMenu(); //

  return (
    <main className="min-h-screen bg-white relative">

      {!isStoreOpen && (
        <div className="bg-red-600 text-white w-full p-4 text-center sticky top-0 z-100 shadow-2xl flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Store size={24} />
            <span>LOJA FECHADA</span>
          </div>
          <p className="text-sm opacity-90 mt-1 font-medium">
            Não estamos a aceitar novos pedidos no momento.
          </p>
        </div>
      )}

      <Header />


      <MenuInterface categories={JSON.parse(JSON.stringify(categories))} />

      <Footer />
      <CartFloat />
      <CartSidebar />
    </main>
  );
}

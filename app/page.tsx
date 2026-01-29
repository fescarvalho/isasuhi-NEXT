import { prisma } from '../lib/prisma'
import { Header } from '../components/header'
import { CartFloat } from '../components/cart-float'
import { CartSidebar } from '../components/cart-sidebar'
import { MenuInterface } from '../components/menu-interface'
import { Footer } from '../components/footer'


export const dynamic = 'force-dynamic'

async function getMenu() {
  // Buscamos categorias e produtos
  const categories = await prisma.category.findMany({
    include: { products: true },
    orderBy: { order: 'asc' }
  })
  return categories
}

export default async function Home() {
  const categories = await getMenu()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Passamos os dados para o componente que controla as abas */}
      <MenuInterface categories={JSON.parse(JSON.stringify(categories))} />
      <Footer />
      <CartFloat />
      <CartSidebar />
    </main>
  )
}
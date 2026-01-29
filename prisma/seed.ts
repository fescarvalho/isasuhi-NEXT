import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Categoria: Combos (Dados do PDF)
  await prisma.category.create({
    data: {
      name: 'Combos',
      order: 1,
      products: {
        create: [
          {
            name: 'Combo IV (30 Peças)',
            description: '5 Sashimis, 10 Hots Filadélfia, 10 Uramakis, 5 Joys com geleia.',
            price: 89.90,
            imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400'
          },
          {
            name: 'Combo I (10 Peças)',
            description: '4 Hots Filadélfia, 4 Hossomaki, 2 Joys.',
            price: 29.90,
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400'
          }
        ]
      }
    }
  })

  // Categoria: Temakis
   await prisma.category.create({
    data: {
      name: 'Temakis',
      order: 2,
      products: {
        create: [
          { name: 'Temaki Salmão', description: 'Unidade', price: 31.90 },
          { name: 'Temaki Camarão Hot', description: 'Unidade, empanado e frito', price: 34.90 },
        ]
      }
    }
  })

  console.log('Cardápio populado!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
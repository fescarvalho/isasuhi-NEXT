import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🌱 Iniciando a população do banco de dados...')

  await prisma.category.create({
    data: {
      name: 'Combos',
      order: 1,
      products: {
        create: [
          {
            name: 'Combo I (10 Peças)',
            description: '4 Hots Filadélfia, 4 Hossomakis, 2 Joys com geleia de manga com maracujá.',
            price: 29.90,
          },
          {
            name: 'Combo II (20 Peças)',
            description: '4 Hossomakis, 4 Uramakis, 4 Hots Filadélfia, 4 Sashimis, 4 Joys com geleia de amora.',
            price: 67.90,
          },
          {
            name: 'Combo III (20 Peças)',
            description: '4 Hots Filadélfia com tartar de salmão, 4 Uramakis, 4 Sashimis, 4 Hossomakis, 4 Joys com cream cheese e cebolinha.',
            price: 69.90,
          },
          {
            name: 'Combo IV (30 Peças)',
            description: '5 Sashimis, 10 Hots Filadélfia, 10 Uramakis, 5 Joys com geleia de abacaxi com pimenta.',
            price: 89.90,
            imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop'
          },
        ]
      }
    }
  })

  // 2. Categoria: Hot Rolls
  await prisma.category.create({
    data: {
      name: 'Hot Rolls',
      order: 2,
      products: {
        create: [
          {
            name: 'Hot Filadélfia (10 unidades)',
            description: 'Crocantes com cream cheese.',
            price: 26.90,
            imageUrl: 'https://media.istockphoto.com/id/1151189763/pt/foto/hot-roll-with-salmon-tempura-on-black-with-reflection.jpg?s=612x612&w=0&k=20&c=4mdQVZGS56MAXVgoLNxymGQbfA0sG9N7mbkrn9JT_rc='
          },
          {
            name: 'Hot com Tartar de Salmão (4 unidades)',
            description: 'Especial com tartar por cima.',
            price: 18.90,
          },
        ]
      }
    }
  })

  // 3. Categoria: Temakis
  await prisma.category.create({
    data: {
      name: 'Temakis',
      order: 3,
      products: {
        create: [
          { name: 'Temaki Salmão', description: 'Unidade tradicional', price: 31.90,imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=400&auto=format&fit=crop' },
          { name: 'Temaki Salmão Hot', description: 'Unidade empanada e frita', price: 33.90 },
          { name: 'Temaki Camarão', description: 'Unidade com camarão', price: 32.90 },
          { name: 'Temaki Camarão Hot', description: 'Unidade de camarão empanado', price: 34.90 },
          { name: 'Temaki Camarão com Salmão', description: 'Unidade mista', price: 34.90 },
          { name: 'Temaki Camarão com Salmão Hot', description: 'Unidade mista empanada', price: 36.90 },
        ]
      }
    }
  })

  // 4. Categoria: Joys (Porções de 4 Unidades)
  await prisma.category.create({
    data: {
      name: 'Joys Especiais (4 Unidades)',
      order: 4,
      products: {
        create: [
          { name: 'Joy com Tartar de Salmão', description: '4 unidades', price: 19.90 },
          { name: 'Joy com Geleia de Abacaxi com Pimenta', description: '4 unidades', price: 19.90 },
          { name: 'Joy com Geleia de Amora', description: '4 unidades', price: 19.90 },
          { name: 'Joy com Geleia de Manga com Maracujá', description: '4 unidades', price: 19.90 },
        ]
      }
    }
  })

   // 5. Categoria: Joys (Unitário)
   await prisma.category.create({
    data: {
      name: 'Joys (Unidade)',
      order: 5,
      products: {
        create: [
          { name: 'Joy com Tartar de Salmão (Unidade)', description: 'Apenas 1 unidade', price: 4.99 },
          { name: 'Joy com Geleia de Abacaxi c/ Pimenta (Unidade)', description: 'Apenas 1 unidade', price: 4.99 },
          { name: 'Joy com Geleia de Amora (Unidade)', description: 'Apenas 1 unidade', price: 4.99 },
          { name: 'Joy com Geleia de Manga c/ Maracujá (Unidade)', description: 'Apenas 1 unidade', price: 4.99 },
        ]
      }
    }
  })

  // 6. Categoria: Uramakis e Hossomakis
  await prisma.category.create({
    data: {
      name: 'Uramakis e Hossomakis',
      order: 6,
      products: {
        create: [
          { name: 'Uramaki Salmão (4 unidades)', description: 'Arroz por fora, algas por dentro', price: 12.00,imageUrl: 'https://images.unsplash.com/photo-1674699991728-0b7d489b2a8a?q=80&w=687&auto=format&fit=crop' },
          { name: 'Hossomaki Salmão (4 unidades)', description: 'Alga por fora, arroz por dentro', price: 12.00 },
        ]
      }
    }
  })

  // 7. Categoria: Sashimi
  await prisma.category.create({
    data: {
      name: 'Sashimi',
      order: 7,
      products: {
        create: [
          { name: 'Sashimi de Salmão (Unidade)', description: 'Fatia fresca de salmão', price: 5.00 },
        ]
      }
    }
  })

  // 8. Categoria: Adicionais
  await prisma.category.create({
    data: {
      name: 'Adicionais',
      order: 8,
      products: {
        create: [
          { name: 'Adicional de Cream Cheese', description: 'Porção extra', price: 1.00 },
          { name: 'Adicional de Geleia de Amora', description: 'Porção extra', price: 1.00 },
          { name: 'Adicional de Geleia de Abacaxi', description: 'Porção extra', price: 1.00 },
          { name: 'Adicional de Geleia de Manga', description: 'Porção extra', price: 1.00 },
          { name: 'Adicional de Tartar de Salmão', description: 'Porção extra', price: 1.00 },
        ]
      }
    }
  })

  console.log('✅ Cardápio completo carregado com sucesso!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
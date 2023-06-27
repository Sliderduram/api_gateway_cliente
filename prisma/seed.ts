import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const places = [
  {
    city: 'São Paulo',
    state: 'São Paulo',
  },
  {
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
  },
  {
    city: 'Belo Horizonte',
    state: 'Minas Gerais',
  },
  {
    city: 'Porto Alegre',
    state: 'Rio Grande do Sul',
  },
  {
    city: 'Curitiba',
    state: 'Paraná',
  },
]

async function run() {
  await prisma.client.deleteMany()
  await prisma.address.deleteMany()

  /**
   * Create 10 clients
   */
  for (let i = 0; i < 10; i++) {
    await prisma.client.create({
      data: {
        code: `${i + 1}`,
        name: `Client ${i + 1}`,
      },
    })
  }

  /**
   * Create 5 addresses for all clients
   */

  for (let i = 0; i < 10; i++) {
    places.forEach(async (place, index) => {
      await prisma.address.create({
        data: {
          cep: '12345678',
          code: `${i + 1}`,
          index: index + 1,
          city: place.city,
          state: place.state,
          number: `${index + 1}`,
          place: `Rua ${index + 1}`,
          complement: `Apt ${index + 1}`,
        },
      })
    })
  }
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

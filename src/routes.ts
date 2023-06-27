import z from 'zod'
import { Request, Response, Router } from 'express'

import { prisma } from './lib/prisma'

const appRoutes = Router()

appRoutes.post(
  '/api/v1/cliente/:codigo/endereco',
  async (req: Request, res: Response) => {
    const { codigo } = req.params

    const createClientAddressBodySchema = z.object({
      place: z.string(),
      number: z.string(),
      complement: z.string().optional(),
      city: z.string(),
      state: z.string(),
      cep: z.string(),
    })

    const validationResult = createClientAddressBodySchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({ message: 'Sent data is invalid' })
    }

    const client = await prisma.client.findUnique({
      where: {
        code: codigo,
      },
    })

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    const index = await prisma.address.count({
      where: {
        code: codigo,
      },
    })

    const address = await prisma.address.create({
      data: {
        code: codigo,
        index: index + 1,
        place: validationResult.data.place,
        number: validationResult.data.number,
        complement: validationResult.data.complement,
        city: validationResult.data.city,
        state: validationResult.data.state,
        cep: validationResult.data.cep,
      },
    })

    return res.status(200).json(address)
  },
)

appRoutes.get(
  '/api/v1/cliente/:codigo/endereco/:indice',
  async (req: Request, res: Response) => {
    const { codigo, indice } = req.params

    const address = await prisma.address.findFirst({
      where: {
        AND: [
          {
            code: codigo,
          },
          {
            index: Number(indice),
          },
        ],
      },
    })

    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }

    return res.status(200).json(address)
  },
)

appRoutes.get(
  '/api/v1/cliente/:codigo/endereco/',
  async (req: Request, res: Response) => {
    const { codigo } = req.params

    const addresses = await prisma.address.findMany({
      where: {
        code: codigo,
      },
    })

    return res.status(200).json(addresses)
  },
)

appRoutes.get(
  '/api/v1/cliente/endereco',
  async (req: Request, res: Response) => {
    const { cidade, page = 1 } = req.query

    const addresses = await prisma.address.findMany({
      where: {
        city: {
          mode: 'insensitive',
          contains: cidade ? cidade.toString() : '',
        },
      },
      take: 10,
      skip: (Number(page) - 1) * 10,
    })

    return res.status(200).json(addresses)
  },
)

appRoutes.post('/api/v1/cliente', async (req: Request, res: Response) => {
  const createUserBodySchema = z.object({
    name: z.string(),
    code: z.string(),
  })

  const validationResult = createUserBodySchema.safeParse(req.body)

  if (!validationResult.success) {
    return res.status(400).json({ message: 'Sent data is invalid' })
  }

  const client = await prisma.client.create({
    data: {
      code: validationResult.data.code,
      name: validationResult.data.name,
    },
  })

  return res.status(201).json(client)
})

appRoutes.get(
  '/api/v1/cliente/:codigo',
  async (req: Request, res: Response) => {
    const { codigo } = req.params

    const client = await prisma.client.findUnique({
      where: {
        code: codigo,
      },
    })

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    return res.status(200).json(client)
  },
)

appRoutes.get('/api/v1/cliente/', async (req: Request, res: Response) => {
  const clientsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const validationResult = clientsQuerySchema.safeParse(req.query)

  if (!validationResult.success) {
    return res.status(400).json({ message: 'Sent data is invalid' })
  }

  const clients = await prisma.client.findMany({
    take: 5,
    skip: (validationResult.data.page - 1) * 5,
  })

  return res.status(200).json(clients)
})

export { appRoutes }

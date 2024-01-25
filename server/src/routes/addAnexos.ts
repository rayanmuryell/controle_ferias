import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { IAnexoAfastamento } from "../types/AnexoAfastamento"

export async function addAnexos(fastify: FastifyInstance) {

    fastify.post('/anexos/:afastamentoid', async (req, res) => {

        const newAnexo = req.body as any
        const addAnexos = await prisma.anexoAfastamento.create({
            
            data: newAnexo

        })

        return { addAnexos }

    })

}
import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export async function createAnexos(fastify: FastifyInstance) {

    fastify.get('/anexos', async () => {

        const Anexos = await prisma.anexoAfastamento.findMany({
        })

        return { Anexos }

    })

}
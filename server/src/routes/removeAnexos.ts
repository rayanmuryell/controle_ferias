import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../lib/prisma"

export async function removeAnexos(fastify: FastifyInstance) {

    fastify.post('/anexos/remove/:anexoid', async (req: FastifyRequest<{
        Params: {
          anexoid: number,
        };
    }>,
    rep: FastifyReply,) => {

        const id = req.params.anexoid
        const removeAnexos = await prisma.anexoAfastamento.delete(
            {
                where: {
                    id: id,
                }
            }
        )

        return { removeAnexos }

    })

}
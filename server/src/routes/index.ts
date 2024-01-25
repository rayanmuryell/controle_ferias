import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export async function indexRoute(fastify: FastifyInstance) {

    fastify.get('/', async () => {

        const Employee = await prisma.employee.findMany({
            include: {
                ferias: true,                
            }
        })

        
        return { Employee }

    })

}
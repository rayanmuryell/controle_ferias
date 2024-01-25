import Fastify from 'fastify'
import cors from '@fastify/cors'


// Importação das Rotas

import { indexRoute } from './routes'
import { newEmployeeRoutes } from './routes/newEmployee'
import { CreateFeriasRoute } from './routes/addVacation'
import { CreateReportFerias } from './routes/VacationReport'
import { createAnexos } from './routes/Anexos'
import { editEmployeeRoutes } from './routes/editEmployee'




async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })


    await fastify.register(cors, {
        origin: true,
    })


    // Definição das Rotas

    await fastify.register(indexRoute)
    await fastify.register(newEmployeeRoutes)
    await fastify.register(CreateFeriasRoute)
    await fastify.register(CreateReportFerias)
    await fastify.register(createAnexos)
    await fastify.register(editEmployeeRoutes)

    await fastify.listen({ port: 3333 })


}

bootstrap()
import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

interface RequestParams {
  id: string;
}

interface RequestBody {
  dataSaida: string;
  dataRetorno: string;
  periodo: string;
  observacao: string;
}

export async function CreateFeriasRoute(fastify: FastifyInstance) {
  fastify.post('/ferias/:id', async (request: FastifyRequest<{ Params: RequestParams, Body: RequestBody }>) => {
    try {
      const { id } = request.params; // Obtém o ID dos parâmetros da URL
      const { dataSaida, dataRetorno, periodo, observacao } = request.body;

      // Obtém o ID do Employee
      const employeeId = parseInt(id, 10);

      // Cria um novo registro na tabela FERIAS associado ao Employee
      const createdFerias = await prisma.ferias.create({
        data: {
          inicioFerias: dataSaida,
          fimFerias: dataRetorno,
          periodo,
          observacao,
          employee: {
            connect: { id: employeeId },
          },
        },
      });

      return { ferias: createdFerias };
    } catch (error) {
      console.error('Erro ao criar férias:', error);
      throw new Error('Erro ao criar férias');
    }
  });
}

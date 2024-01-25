import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

interface EmployeeData {
    matricula: number;
    nome: string;
    dataNascimento: Date;
    dataAdmissao: Date;
    cpf: string;
    secretaria: string;
}

export async function editEmployeeRoutes(fastify: FastifyInstance) {
    fastify.put('/editEmployee/:employeeid', async (request: FastifyRequest<{ Body: EmployeeData, Params: {
        employeeid: string,
      }; }>, reply) => {
      try {
        const { matricula, nome, dataNascimento, dataAdmissao, cpf, secretaria } = request.body;
        const id = request.params.employeeid
  
        console.log({ id })
        const employee = await prisma.employee.update({
            
            where: {
                id: Number(id)
            },
            data: {
              matricula,
              nome,
              dataNascimento,
              dataAdmissao,
              cpf,
              secretaria,
            },
          });
  
        return reply.code(201).send({ employee });
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target.includes('cpf')) {
          // Trate o erro de CPF duplicado aqui
          console.error('Erro: CPF duplicado');
          return reply.code(400).send({ error: 'CPF já está em uso' });
        } else {
          // Outros erros
          console.error('Erro no servidor:', error);
          return reply.code(500).send({ error: 'Internal Server Error' });
        }
      }
    });
  }

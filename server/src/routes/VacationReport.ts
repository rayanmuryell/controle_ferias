import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces"
import fs from 'fs'
import { Readable } from "stream";




export async function CreateReportFerias(fastify: FastifyInstance) {
    fastify.get('/ferias/report/', async (request: FastifyRequest, reply: FastifyReply) => {
        const fonts = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique',
            },
        };
        const printer = new PDFPrinter(fonts);

        const docDefinitions: TDocumentDefinitions = {
            defaultStyle: { font: 'Helvetica' },
            content: [{ text: 'Teste do PDF' }],
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinitions);

        const chunks: Uint8Array[] = [];

        pdfDoc.on('data', (chunk: Uint8Array) => {
            chunks.push(chunk);
        });

        pdfDoc.end();

        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            const pdfStream = new Readable();
            pdfStream.push(pdfBuffer);
            pdfStream.push(null);

            reply.code(200).header('Content-Type', 'application/pdf').send(pdfStream);
        });
    });
}
-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "matricula" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "secretaria" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Afastamento" (
    "id" SERIAL NOT NULL,
    "inicioFerias" TIMESTAMP(3) NOT NULL,
    "fimFerias" TIMESTAMP(3) NOT NULL,
    "periodo" TEXT NOT NULL DEFAULT '2022-2023',
    "observacao" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'FÉRIAS',
    "employeeId" INTEGER NOT NULL,
    "anexoAfastamentoId" INTEGER,

    CONSTRAINT "Afastamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnexoAfastamento" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "AnexoAfastamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_matricula_key" ON "Employee"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");

-- AddForeignKey
ALTER TABLE "Afastamento" ADD CONSTRAINT "Afastamento_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Afastamento" ADD CONSTRAINT "Afastamento_anexoAfastamentoId_fkey" FOREIGN KEY ("anexoAfastamentoId") REFERENCES "AnexoAfastamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

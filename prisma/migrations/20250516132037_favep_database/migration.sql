-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "cpf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GerenciaPropriedade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "localizacao" TEXT NOT NULL,
    "produtividade" TEXT NOT NULL,
    "cultura" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GerenciaPropriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GerenciaMaquinario" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kmRodado" DOUBLE PRECISION NOT NULL,
    "propriedadeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GerenciaMaquinario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GerenciaProducao" (
    "id" SERIAL NOT NULL,
    "cultura" TEXT NOT NULL,
    "safra" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "propriedadeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GerenciaProducao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GerenciaMovimentacao" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "propriedadeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GerenciaMovimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GerenciaFinancas" (
    "id" SERIAL NOT NULL,
    "lucro" DOUBLE PRECISION NOT NULL,
    "despesa" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "propriedadeId" INTEGER NOT NULL,
    "movimentacaoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GerenciaFinancas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- AddForeignKey
ALTER TABLE "GerenciaPropriedade" ADD CONSTRAINT "GerenciaPropriedade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaMaquinario" ADD CONSTRAINT "GerenciaMaquinario_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "GerenciaPropriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaMaquinario" ADD CONSTRAINT "GerenciaMaquinario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaProducao" ADD CONSTRAINT "GerenciaProducao_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "GerenciaPropriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaProducao" ADD CONSTRAINT "GerenciaProducao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaMovimentacao" ADD CONSTRAINT "GerenciaMovimentacao_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "GerenciaPropriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaMovimentacao" ADD CONSTRAINT "GerenciaMovimentacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaFinancas" ADD CONSTRAINT "GerenciaFinancas_movimentacaoId_fkey" FOREIGN KEY ("movimentacaoId") REFERENCES "GerenciaMovimentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaFinancas" ADD CONSTRAINT "GerenciaFinancas_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "GerenciaPropriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GerenciaFinancas" ADD CONSTRAINT "GerenciaFinancas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

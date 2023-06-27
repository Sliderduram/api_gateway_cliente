-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "place" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_code_key" ON "clients"("code");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_code_fkey" FOREIGN KEY ("code") REFERENCES "clients"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

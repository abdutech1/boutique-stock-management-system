/*
  Warnings:

  - A unique constraint covering the columns `[userId,weekStart,weekEnd]` on the table `salarypayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `salarypayment_userId_weekStart_weekEnd_key` ON `salarypayment`(`userId`, `weekStart`, `weekEnd`);

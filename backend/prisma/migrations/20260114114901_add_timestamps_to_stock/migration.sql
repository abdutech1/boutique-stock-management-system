/*
  Warnings:

  - Added the required column `updatedAt` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock`
  ADD COLUMN `createdAt` DATETIME(3) NULL,
  ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- Backfill existing rows with current timestamp (or any valid datetime)
UPDATE `stock`
  SET `createdAt` = NOW(3),
      `updatedAt` = NOW(3)
  WHERE `createdAt` IS NULL OR `updatedAt` IS NULL;

-- Now make them NOT NULL (safe because we filled them)
ALTER TABLE `stock`
  MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

/*
  Warnings:

  - Added the required column `updatedAt` to the `sale` table without a default value. This is not possible if the table is not empty.
*/

-- Step 1: Drop foreign keys (as generated - safe to keep)
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_employeeId_fkey`;
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_priceCategoryId_fkey`;

-- Step 2: Add new columns as NULLable first (this won't fail on existing data)
ALTER TABLE `sale`
  ADD COLUMN `status` ENUM('DRAFT', 'CONFIRMED', 'CANCELLED') NULL DEFAULT 'DRAFT',
  ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- Step 3: Backfill values for the existing 11 rows
-- You can change 'DRAFT' → 'CONFIRMED' if you prefer old sales to be considered confirmed
UPDATE `sale`
SET 
  `status`    = 'DRAFT',
  `updatedAt` = NOW(3)
WHERE `status` IS NULL OR `updatedAt` IS NULL;

-- Step 4: Now make columns NOT NULL (safe because we filled them)
ALTER TABLE `sale`
  MODIFY `status` ENUM('DRAFT', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- Step 5: Re-add foreign keys (as generated, but with new names Prisma expects)
ALTER TABLE `sale` ADD CONSTRAINT `sale_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `sale` ADD CONSTRAINT `sale_priceCategoryId_fkey` FOREIGN KEY (`priceCategoryId`) REFERENCES `pricecategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
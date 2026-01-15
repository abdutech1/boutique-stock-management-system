-- Step 1: Add new columns as NULLable first (safe, no error on existing rows)
ALTER TABLE `user`
  ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
  ADD COLUMN `isActive` BOOLEAN NULL DEFAULT true,
  ADD COLUMN `createdAt` DATETIME(3) NULL,
  ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- Step 2: Fill values for the existing 5 rows
-- For phoneNumber: using a temporary unique placeholder (you'll update real values later)
-- Feel free to change the placeholder pattern if you prefer
UPDATE `user`
SET 
  `phoneNumber` = CONCAT('TEMP_', LPAD(`id`, 5, '0')),  -- e.g. TEMP_00001, TEMP_00002 → unique
  `isActive`    = true,
  `createdAt`   = NOW(3),
  `updatedAt`   = NOW(3)
WHERE `phoneNumber` IS NULL;

-- Step 3: Now make columns NOT NULL (safe because we filled them)
ALTER TABLE `user`
  MODIFY `phoneNumber` VARCHAR(191) NOT NULL,
  MODIFY `isActive`    BOOLEAN NOT NULL DEFAULT true,
  MODIFY `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  MODIFY `updatedAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- Step 4: Add the unique index/constraint
CREATE UNIQUE INDEX `user_phoneNumber_key` ON `user`(`phoneNumber`);

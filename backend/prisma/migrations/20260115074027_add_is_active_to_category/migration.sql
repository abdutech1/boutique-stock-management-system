-- AlterTable
ALTER TABLE `category` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_name_key` TO `category_name_key`;

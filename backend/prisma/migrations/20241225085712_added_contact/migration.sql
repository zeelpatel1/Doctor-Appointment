/*
  Warnings:

  - Added the required column `constact` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctor` ADD COLUMN `constact` VARCHAR(191) NOT NULL;

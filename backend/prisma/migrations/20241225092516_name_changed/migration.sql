/*
  Warnings:

  - You are about to drop the column `constact` on the `doctor` table. All the data in the column will be lost.
  - Added the required column `contact` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `constact`,
    ADD COLUMN `contact` VARCHAR(191) NOT NULL;

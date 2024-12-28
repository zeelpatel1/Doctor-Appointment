-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_walletId_fkey`;

-- DropIndex
DROP INDEX `Patient_doctorId_fkey` ON `patient`;

-- AlterTable
ALTER TABLE `patient` MODIFY `walletId` INTEGER NULL,
    MODIFY `doctorId` INTEGER NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

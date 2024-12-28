-- AddForeignKey
ALTER TABLE `VisitedDoctor` ADD CONSTRAINT `VisitedDoctor_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitedDoctor` ADD CONSTRAINT `VisitedDoctor_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The values [pending,approved,rejected] on the enum `Appointment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `appointment` MODIFY `status` ENUM('available', 'booked', 'completed', 'cancelled') NOT NULL;

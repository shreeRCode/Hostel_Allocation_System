/*
  Warnings:

  - You are about to alter the column `role` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Admin` MODIFY `role` ENUM('HOSTEL_ADMIN') NOT NULL DEFAULT 'HOSTEL_ADMIN';

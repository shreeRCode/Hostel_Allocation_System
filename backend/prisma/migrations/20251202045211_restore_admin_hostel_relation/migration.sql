-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `hostelId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_hostelId_fkey` FOREIGN KEY (`hostelId`) REFERENCES `Hostel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

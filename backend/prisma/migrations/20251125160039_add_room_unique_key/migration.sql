/*
  Warnings:

  - A unique constraint covering the columns `[hostelId,roomNumber]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Room_hostelId_roomNumber_key` ON `Room`(`hostelId`, `roomNumber`);

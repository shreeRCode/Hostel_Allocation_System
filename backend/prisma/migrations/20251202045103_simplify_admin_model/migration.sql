/*
  Warnings:

  - You are about to drop the column `distance` on the `Hostel` table. All the data in the column will be lost.
  - You are about to drop the column `currentOccupancy` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `Student` table. All the data in the column will be lost.
  - Made the column `disciplineScore` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Hostel` DROP COLUMN `distance`;

-- AlterTable
ALTER TABLE `Room` DROP COLUMN `currentOccupancy`,
    ADD COLUMN `occupiedCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `preferences`,
    ADD COLUMN `preferredHostel` VARCHAR(191) NULL,
    MODIFY `disciplineScore` INTEGER NOT NULL DEFAULT 0;

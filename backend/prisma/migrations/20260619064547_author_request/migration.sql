/*
  Warnings:

  - You are about to drop the column `published` on the `blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog` DROP COLUMN `published`,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ACHIVED') NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE `AuthorRequest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AuthorRequest_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuthorRequest` ADD CONSTRAINT `AuthorRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

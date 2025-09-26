/*
  Warnings:

  - A unique constraint covering the columns `[password_reset_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `password_reset_expires` DATETIME(3) NULL,
    ADD COLUMN `password_reset_token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_password_reset_token_key` ON `User`(`password_reset_token`);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `email_verification_expires` DATETIME(3) NULL,
    ADD COLUMN `email_verification_token` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

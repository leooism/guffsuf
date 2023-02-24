-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `user_fname` VARCHAR(50) NOT NULL,
    `user_lname` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Users_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Email` (
    `email` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_Email_email_key`(`email`),
    UNIQUE INDEX `User_Email_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Password` (
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `token` VARCHAR(250) NOT NULL DEFAULT '',

    UNIQUE INDEX `User_Password_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User_Email`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Email` ADD CONSTRAINT `User_Email_email_fkey` FOREIGN KEY (`email`) REFERENCES `User_Password`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

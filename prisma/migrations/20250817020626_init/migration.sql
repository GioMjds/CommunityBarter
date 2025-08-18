/*
  Warnings:

  - You are about to drop the column `profileImage` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `profileImage`,
    ADD COLUMN `profile_image` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categories_name_key`(`name`),
    INDEX `idx_categories_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `estimated_value` DECIMAL(10, 2) NULL,
    `condition_type` ENUM('new', 'like_new', 'good', 'fair', 'poor') NOT NULL,
    `status` ENUM('available', 'pending', 'traded', 'withdrawn') NOT NULL DEFAULT 'available',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_items_user_id`(`user_id`),
    INDEX `idx_items_category_id`(`category_id`),
    INDEX `idx_items_status`(`status`),
    INDEX `idx_items_condition`(`condition_type`),
    INDEX `idx_items_created_at`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_images` (
    `id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `cloudinary_url` TEXT NOT NULL,
    `cloudinary_public_id` VARCHAR(255) NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_item_images_item_id`(`item_id`),
    INDEX `idx_item_images_order`(`item_id`, `display_order`),
    INDEX `idx_item_images_primary`(`item_id`, `is_primary`),
    INDEX `idx_item_images_cloudinary_public_id`(`cloudinary_public_id`),
    UNIQUE INDEX `item_images_item_id_is_primary_key`(`item_id`, `is_primary`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trades` (
    `id` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `requester_item_id` VARCHAR(191) NOT NULL,
    `owner_item_id` VARCHAR(191) NOT NULL,
    `status` ENUM('proposed', 'withdrawn', 'rejected', 'accepted', 'in_progress', 'completed', 'rated') NOT NULL DEFAULT 'proposed',
    `notes` TEXT NULL,
    `proposed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accepted_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `cancelled_at` DATETIME(3) NULL,

    INDEX `idx_trades_requester`(`requester_id`),
    INDEX `idx_trades_owner`(`owner_id`),
    INDEX `idx_trades_status`(`status`),
    INDEX `idx_trades_proposed_at`(`proposed_at`),
    INDEX `idx_trades_items`(`requester_item_id`, `owner_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `trade_id` VARCHAR(191) NOT NULL,
    `reviewer_id` VARCHAR(191) NOT NULL,
    `reviewee_id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_reviews_reviewee`(`reviewee_id`),
    INDEX `idx_reviews_rating`(`rating`),
    INDEX `idx_reviews_created_at`(`created_at`),
    UNIQUE INDEX `reviews_trade_id_reviewer_id_key`(`trade_id`, `reviewer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `trade_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_messages_trade`(`trade_id`),
    INDEX `idx_messages_receiver_unread`(`receiver_id`, `is_read`),
    INDEX `idx_messages_created_at`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_users_email` ON `users`(`email`);

-- CreateIndex
CREATE INDEX `idx_users_username` ON `users`(`username`);

-- CreateIndex
CREATE INDEX `idx_users_created_at` ON `users`(`createdAt`);

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_images` ADD CONSTRAINT `item_images_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trades` ADD CONSTRAINT `trades_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trades` ADD CONSTRAINT `trades_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trades` ADD CONSTRAINT `trades_requester_item_id_fkey` FOREIGN KEY (`requester_item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trades` ADD CONSTRAINT `trades_owner_item_id_fkey` FOREIGN KEY (`owner_item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_trade_id_fkey` FOREIGN KEY (`trade_id`) REFERENCES `trades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewee_id_fkey` FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_trade_id_fkey` FOREIGN KEY (`trade_id`) REFERENCES `trades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

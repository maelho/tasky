ALTER TABLE `board` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `board` DROP COLUMN `orgId`;
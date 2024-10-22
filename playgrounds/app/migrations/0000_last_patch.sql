CREATE TABLE `snippets_table` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`title` text NOT NULL,
	`codeLeft` text NOT NULL,
	`codeRight` text NOT NULL,
	`createdAt` integer DEFAULT 0 NOT NULL,
	`updatedAt` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`githubId` text NOT NULL,
	`githubUsername` text NOT NULL,
	`githubAvatarUrl` text NOT NULL,
	`createdAt` integer DEFAULT 0 NOT NULL,
	`updatedAt` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubId_unique` ON `users_table` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubUsername_unique` ON `users_table` (`githubUsername`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubAvatarUrl_unique` ON `users_table` (`githubAvatarUrl`);
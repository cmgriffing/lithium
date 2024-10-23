DROP INDEX IF EXISTS "users_table_email_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_table_githubId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_table_githubUsername_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_table_githubAvatarUrl_unique";--> statement-breakpoint
ALTER TABLE `snippets_table` ALTER COLUMN "shadowEnabled" TO "shadowEnabled" integer NOT NULL DEFAULT true;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubId_unique` ON `users_table` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubUsername_unique` ON `users_table` (`githubUsername`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_githubAvatarUrl_unique` ON `users_table` (`githubAvatarUrl`);
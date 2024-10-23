ALTER TABLE `snippets_table` ADD `snippetWidth` integer DEFAULT 450 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `yPadding` integer DEFAULT 42 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `xPadding` integer DEFAULT 42 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `shadowEnabled` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `shadowOffsetY` integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `shadowBlur` integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `shadowColor` text DEFAULT '#000000' NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `shadowOpacity` real DEFAULT 0.6 NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `bgColor` text DEFAULT '#a3d0ff' NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `language` text DEFAULT 'tsx' NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ADD `theme` text DEFAULT 'nord' NOT NULL;--> statement-breakpoint
ALTER TABLE `snippets_table` ALTER COLUMN "userId" TO "userId" text NOT NULL REFERENCES users_table(id) ON DELETE no action ON UPDATE no action;
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users_table', {
  id: text().primaryKey(),
  email: text().notNull().unique(),
  githubId: text().notNull().unique(),
  githubUsername: text().notNull().unique(),
  githubAvatarUrl: text().notNull().unique(),
  createdAt: int().notNull().default(0),
  updatedAt: int().notNull().default(0),
})

export const snippetsTable = sqliteTable('snippets_table', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => usersTable.id),
  title: text().notNull(),
  codeLeft: text().notNull(),
  codeRight: text().notNull(),
  createdAt: int().notNull().default(0),
  updatedAt: int().notNull().default(0),
})

export const schema = {
  users: usersTable,
  snippets: snippetsTable,
}

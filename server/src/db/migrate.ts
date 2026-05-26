/**
 * Drizzle SQL migration runner.
 *
 * Reads `.sql` files from the server/drizzle directory, sorted by filename,
 * and applies each one sequentially against the SQLite database.
 *
 * Usage: pnpm --filter server db:migrate   (or: tsx src/db/migrate.ts)
 *
 * Migration convention:
 * - SQL files live in server/drizzle/ with zero-padded numeric prefixes (e.g., 0000_*.sql).
 * - Files are sorted lexicographically; applied in order.
 * - Applied migration filenames are tracked in `__schema_migrations`.
 * - The first locale migration is also safe if startup compatibility migrations
 *   already added the column before this runner was executed.
 */

import { libsqlClient } from './index.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const drizzleDir = path.resolve(__dirname, '../../drizzle')

async function ensureMigrationTable(): Promise<void> {
  await libsqlClient.execute(`
    CREATE TABLE IF NOT EXISTS __schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `)
}

async function hasAppliedMigration(id: string): Promise<boolean> {
  const result = await libsqlClient.execute({
    sql: 'SELECT id FROM __schema_migrations WHERE id = ?',
    args: [id],
  })

  return result.rows.length > 0
}

async function markMigrationApplied(id: string): Promise<void> {
  await libsqlClient.execute({
    sql: 'INSERT OR IGNORE INTO __schema_migrations (id, applied_at) VALUES (?, ?)',
    args: [id, new Date().toISOString()],
  })
}

function isDuplicateColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err)

  return message.toLowerCase().includes('duplicate column name')
}

async function applyMigration(file: string): Promise<void> {
  if (await hasAppliedMigration(file)) {
    console.log(`[migrate] Skipping ${file}; already applied`)
    return
  }

  const sql = fs.readFileSync(path.join(drizzleDir, file), 'utf-8').trim()
  if (!sql) {
    console.log(`[migrate] Skipping ${file}; empty migration`)
    await markMigrationApplied(file)
    return
  }

  console.log(`[migrate] Applying ${file}...`)

  try {
    await libsqlClient.executeMultiple(sql)
  } catch (err) {
    if (file === '0000_add_locale_trials.sql' && isDuplicateColumnError(err)) {
      console.log(`[migrate] ${file} already satisfied; marking as applied`)
      await markMigrationApplied(file)
      return
    }

    throw err
  }

  await markMigrationApplied(file)
}

async function runMigrations(): Promise<void> {
  if (!fs.existsSync(drizzleDir)) {
    console.log('[migrate] No drizzle/ directory — nothing to apply')
    return
  }

  const files = fs
    .readdirSync(drizzleDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  if (files.length === 0) {
    console.log('[migrate] No .sql migration files found')
    return
  }

  await ensureMigrationTable()

  for (const file of files) {
    await applyMigration(file)
  }

  console.log(`[migrate] Applied ${files.length} migration(s)`)
}

runMigrations()
  .then(() => {
    console.log('[migrate] Done')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[migrate] Failed:', err)
    process.exit(1)
  })

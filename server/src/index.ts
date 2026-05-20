import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import trialsRouter from './routes/trials.js'
import galleryRouter from './routes/gallery.js'
import tribunalsRouter from './routes/tribunals.js'
import authRouter from './routes/auth.js'
import profileRouter from './routes/profile.js'
import { libsqlClient } from './db/index.js'
import { seedSampleTrials } from './seedSamples.js'
import {
  authRateLimit,
  configureTrustProxy,
  requireValidOrigin,
  securityHeaders,
  trialRateLimit,
} from './security.js'

const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    profile_slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS oauth_accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_accounts_provider_account
    ON oauth_accounts(provider, provider_account_id);
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  CREATE TABLE IF NOT EXISTS oauth_states (
    id TEXT PRIMARY KEY,
    code_verifier TEXT NOT NULL,
    return_to TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);
  CREATE TABLE IF NOT EXISTS trials (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    claim_token_hash TEXT,
    case_text TEXT NOT NULL,
    tribunal_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    current_step TEXT,
    case_summary TEXT,
    charge TEXT,
    verdict TEXT,
    score INTEGER,
    score_label TEXT,
    final_reasoning TEXT,
    sentence TEXT,
    share_card_json TEXT,
    safety_message TEXT,
    safety_type TEXT,
    appeal_of_id TEXT REFERENCES trials(id),
    appeal_ground TEXT,
    appeal_text TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,
    model_used TEXT,
    pipeline_version TEXT NOT NULL DEFAULT '1.0',
    raw_llm_responses TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );
  CREATE TABLE IF NOT EXISTS trial_turns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trial_id TEXT NOT NULL REFERENCES trials(id),
    phase TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    role TEXT NOT NULL,
    content_json TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS panel_judgments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trial_id TEXT NOT NULL REFERENCES trials(id),
    agent_name TEXT NOT NULL,
    role TEXT NOT NULL,
    judgment TEXT NOT NULL,
    leaning TEXT NOT NULL,
    key_principle TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_trials_status ON trials(status);
  CREATE INDEX IF NOT EXISTS idx_trials_created_at ON trials(created_at);
  CREATE INDEX IF NOT EXISTS idx_trial_turns_trial_id ON trial_turns(trial_id);
  CREATE INDEX IF NOT EXISTS idx_panel_judgments_trial_id ON panel_judgments(trial_id);
`

async function ensureColumn(tableName: string, columnName: string, definition: string) {
  const result = await libsqlClient.execute(`PRAGMA table_info(${tableName})`)
  const hasColumn = result.rows.some((row) => row.name === columnName)
  if (!hasColumn) {
    await libsqlClient.execute(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`)
  }
}

async function runCompatibilityMigrations() {
  await ensureColumn('trials', 'user_id', 'user_id TEXT REFERENCES users(id)')
  await ensureColumn('trials', 'claim_token_hash', 'claim_token_hash TEXT')
  await libsqlClient.execute(`CREATE INDEX IF NOT EXISTS idx_trials_user_id ON trials(user_id)`)
  await libsqlClient.execute(`CREATE INDEX IF NOT EXISTS idx_trials_claim_token_hash ON trials(claim_token_hash)`)

  await libsqlClient.execute(`
    UPDATE trials
    SET is_public = 1
    WHERE status = 'completed'
      AND is_public = 0
      AND user_id IS NULL
      AND claim_token_hash IS NULL
  `)
}

async function bootstrap() {
  await libsqlClient.executeMultiple(MIGRATION_SQL)
  await runCompatibilityMigrations()
  console.log('[DB] Migration complete.')
  await seedSampleTrials()
  console.log('[DB] Sample trials seeded.')

  const app = express()
  const PORT = process.env.PORT ?? 3001
  configureTrustProxy(app)

  app.use(cors({
    origin: process.env.APP_BASE_URL || 'http://localhost:5173',
    credentials: true,
  }))

  app.use(securityHeaders)
  app.use(express.json({ limit: '10kb' }))
  app.use(requireValidOrigin)

  app.use('/api/auth', (req, res, next) => {
    const skipAuthRateLimit = req.method === 'GET' && req.path === '/me'

    if (skipAuthRateLimit) {
      next()
      return
    }
    authRateLimit(req, res, next)
  }, authRouter)
  app.use('/api/profile', profileRouter)
  app.use('/api/trials', (req, res, next) => {
    if (req.method === 'POST' && (req.path === '/' || req.path.endsWith('/appeal'))) {
      trialRateLimit(req, res, next)
      return
    }
    next()
  }, trialsRouter)
  app.use('/api/gallery', galleryRouter)
  app.use('/api/tribunals', tribunalsRouter)

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.listen(PORT, () => {
    console.log(`[Server] The Tribunal is in session on http://localhost:${PORT}`)
  })
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err)
  process.exit(1)
})

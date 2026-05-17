import { defineConfig } from 'drizzle-kit'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: `file:${path.resolve(__dirname, './data/tribunal.db')}`,
  },
})

import { promises as fs } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { execSync } from 'node:child_process'
import path from 'node:path'

/**
 * Seed the Cloudflare D1 database with Nuxt Content SQL dump.
 * Nuxt Content v3 generates a gzipped+base64 SQL dump during build
 * that must be loaded into D1 for server-side content queries to work.
 */

const ROOT = path.resolve('.output/public/__nuxt_content')

async function seedCollection(name) {
  const dumpPath = path.join(ROOT, name, 'sql_dump.txt')

  try {
    await fs.access(dumpPath)
  } catch {
    console.warn(`[seed-d1] No dump for collection "${name}" at ${dumpPath}`)
    return
  }

  const data = await fs.readFile(dumpPath, 'utf-8')
  const buf = Buffer.from(data, 'base64')
  const sql = gunzipSync(buf).toString('utf-8')
  const stmts = JSON.parse(sql)

  // Write clean SQL file (strip comments from statement-level hints)
  const sqlFile = `/tmp/d1_seed_${name}.sql`
  const out = stmts.map(s => s.replace(/;\s*--.*$/, ';')).join('\n')
  await fs.writeFile(sqlFile, out)

  console.warn(`[seed-d1] Seeding "${name}" with ${stmts.length} statements...`)

  // Drop existing tables first to avoid conflicts
  try {
    execSync(
      `npx wrangler d1 execute old-austin-grouch --remote --command "DROP TABLE IF EXISTS _content_${name}; DROP TABLE IF EXISTS _content_info;"`,
      { stdio: 'inherit' }
    )
  } catch {
    // Tables might not exist yet, that's fine
  }

  execSync(
    `npx wrangler d1 execute old-austin-grouch --remote --file=${sqlFile}`,
    { stdio: 'inherit' }
  )

  console.warn(`[seed-d1] ✓ Collection "${name}" seeded.`)
}

// Discover collections from the dump directory
const entries = await fs.readdir(ROOT, { withFileTypes: true })
for (const entry of entries) {
  if (entry.isDirectory()) {
    await seedCollection(entry.name)
  }
}

console.warn('[seed-d1] Done.')

import { initDb } from './db.ts'
import { createSchema } from './schema.ts'
import { seedData } from './seed.ts'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

// Initialize database (create if doesn't exist)
const dbFile = './data.db'
const needsSeed = !existsSync(dbFile)

const db = initDb()
createSchema(db)

// Only seed if database is new
if (needsSeed) {
  seedData(db)
}

// Find all SQL files in practice folder
const practiceDir = './practice'
const files = readdirSync(practiceDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.log('❌ No SQL files found in practice/ folder')
  db.close()
  process.exit(1)
}

// Get the highest numbered file
const latestFile = files[files.length - 1]
const filePath = join(practiceDir, latestFile)

console.log(`Running from: ${latestFile}`)

// Read the file
const sqlFile = readFileSync(filePath, 'utf8')
const lines = sqlFile.split('\n')

// Find all queries in ANSWER SPACE sections
const queries: string[] = []
let inAnswerSpace = false
let currentQuery = ''

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  const trimmed = line.trim()
  
  // Detect ANSWER SPACE section start
  if (trimmed.includes('ANSWER SPACE')) {
    inAnswerSpace = true
    currentQuery = ''
    continue
  }
  
  // Detect section end (new header or end of file)
  if (inAnswerSpace && trimmed.startsWith('-- ===')) {
    inAnswerSpace = false
    if (currentQuery.trim()) {
      queries.push(currentQuery.trim())
    }
    currentQuery = ''
    continue
  }
  
  // Collect query lines (skip blank lines and comments)
  if (inAnswerSpace && trimmed && !trimmed.startsWith('--')) {
    currentQuery += ' ' + trimmed
  }
}

// Don't forget the last query
if (inAnswerSpace && currentQuery.trim()) {
  queries.push(currentQuery.trim())
}

if (queries.length === 0) {
  console.log('❌ No queries found in file')
  console.log('Add queries in ANSWER SPACE sections')
  db.close()
  process.exit(1)
}

// Get the last query
const query = queries[queries.length - 1]

console.log('Query:', query)
console.log('Result:')

try {
  const result = db.query(query).all()
  if (result.length === 0) {
    console.log('(No results)')
  } else {
    console.table(result)
  }
} catch (e: any) {
  console.log('Error:', e.message)
}

db.close()

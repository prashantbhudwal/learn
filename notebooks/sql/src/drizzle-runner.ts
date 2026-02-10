import { readdirSync } from 'fs'
import { join } from 'path'

console.log('🎯 Drizzle ORM Runner\n')

// Get lesson number from command line args
const lessonNumber = process.argv[2]

// Find all .ts files in practice folder (exclude .sql files)
const practiceDir = './practice'
const files = readdirSync(practiceDir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.drizzle.ts'))
  .sort()

if (files.length === 0) {
  console.log('❌ No .ts files found in practice/ folder')
  process.exit(1)
}

let targetFile: string

if (lessonNumber) {
  // Find file matching the lesson number (e.g., "05" matches "05-and-operator.ts")
  const paddedNumber = lessonNumber.padStart(2, '0')
  targetFile = files.find((f) => f.startsWith(paddedNumber)) || ''

  if (!targetFile) {
    console.log(`❌ No lesson file found for number: ${lessonNumber}`)
    console.log('\nAvailable lessons:')
    files.forEach((f) => {
      const num = f.split('-')[0]
      console.log(`   bun run drizzle ${num}  (${f})`)
    })
    process.exit(1)
  }
} else {
  // Get the highest numbered file (latest lesson)
  targetFile = files[files.length - 1]
}

console.log(`Running from: ${targetFile}\n`)

// Import and run the queries from the file
const filePath = join(process.cwd(), practiceDir, targetFile)
const module = await import(filePath)

// Look for query1, query2, query3 exports
const queries = []
if (module.query1) queries.push({ name: 'Query 1', fn: module.query1 })
if (module.query2) queries.push({ name: 'Query 2', fn: module.query2 })
if (module.query3) queries.push({ name: 'Query 3', fn: module.query3 })

if (queries.length === 0) {
  console.log('❌ No query exports found in file')
  console.log('Export your queries as: export const query1 = () => ...')
  console.log('                          export const query2 = () => ...')
  console.log('                          export const query3 = () => ...')
  process.exit(1)
}

// Run all queries and show results
for (const { name, fn } of queries) {
  console.log(`\n📊 Running ${name}...`)
  try {
    const result = await fn()
    if (result && Array.isArray(result)) {
      if (result.length === 0) {
        console.log('   (No results)')
      } else {
        console.table(result)
      }
    } else if (result) {
      console.log(result)
    } else {
      console.log('   (Query returned undefined)')
    }
  } catch (e: any) {
    console.log(`❌ ${name} Error:`, e.message)
  }
}

console.log('\n💡 Usage:')
console.log('   bun run drizzle           (runs latest lesson)')
console.log('   bun run drizzle 05        (runs lesson 05)')
console.log('\n📚 Available lessons:')
files.forEach((f) => {
  const num = f.split('-')[0]
  console.log(`   ${num} - ${f}`)
})

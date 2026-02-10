import { Database } from 'bun:sqlite'

const DB_PATH = './data.db'

export function getDb(): Database {
  return new Database(DB_PATH)
}

export function initDb(): Database {
  const db = new Database(DB_PATH)
  db.exec('PRAGMA foreign_keys = ON')
  return db
}

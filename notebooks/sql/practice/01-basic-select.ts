import { db } from '../src/drizzle/db'
import { users } from '../src/drizzle/schema'

// SQL: SELECT * FROM users
export const query = () => db.select().from(users)

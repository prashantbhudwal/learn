import { db } from '../src/drizzle/db'
import { users } from '../src/drizzle/schema'
import { eq } from 'drizzle-orm'

// SQL: select * from users where first_name = 'Alice'
export const query = () =>
  db.select().from(users).where(eq(users.firstName, 'Alice'))

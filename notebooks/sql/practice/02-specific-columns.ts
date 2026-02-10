import { db } from '../src/drizzle/db'
import { users } from '../src/drizzle/schema'

// SQL: SELECT first_name, email FROM users
export const query = () =>
  db
    .select({
      firstName: users.firstName,
      email: users.email,
    })
    .from(users)

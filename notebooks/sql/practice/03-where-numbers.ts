import { db } from '../src/drizzle/db'
import { orders } from '../src/drizzle/schema'
import { gt } from 'drizzle-orm'

// SQL: SELECT * FROM orders WHERE total_amount > 100
export const query = () =>
  db.select().from(orders).where(gt(orders.totalAmount, 100))

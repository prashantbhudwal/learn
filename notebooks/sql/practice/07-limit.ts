import { db } from '../src/drizzle/db'
import { products } from '../src/drizzle/schema'
import { desc } from 'drizzle-orm'

// SQL: select * from products order by price desc limit 3
export const query = () =>
  db.select().from(products).orderBy(desc(products.price)).limit(3)

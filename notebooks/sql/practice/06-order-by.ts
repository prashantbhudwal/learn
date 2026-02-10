import { db } from '../src/drizzle/db'
import { products } from '../src/drizzle/schema'
import { asc } from 'drizzle-orm'

// SQL: select * from products order by price
export const query = () =>
  db.select().from(products).orderBy(asc(products.price))

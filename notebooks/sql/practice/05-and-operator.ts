import { db } from '../src/drizzle/db'
import { products } from '../src/drizzle/schema'
import { and, lt, gt } from 'drizzle-orm'

// SQL: select * from products where stock < 100 and price > 50
export const query = () =>
  db
    .select()
    .from(products)
    .where(and(lt(products.stock, 100), gt(products.price, 50)))

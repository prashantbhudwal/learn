import { db } from '../src/drizzle/db'
import { products } from '../src/drizzle/schema'

// SQL: select distinct category_id from products
export const query = () =>
  db
    .selectDistinct({
      categoryId: products.categoryId,
    })
    .from(products)

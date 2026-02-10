import { db } from '../src/drizzle/db'
import { products, orders } from '../src/drizzle/schema'
import { count, avg, gt, isNotNull } from 'drizzle-orm'

/* =====================================================
   QUERY 1
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 1
   -----------------------------------------------------
   Show the top 5 most expensive products that are currently
   in stock. Display only the product ID and name, sorted by
   price from highest to lowest. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 1
   -----------------------------------------------------
   Chain methods in order of execution:
   .from() → .where() → .orderBy() → .limit()
   
   Import for comparison: import { gt } from 'drizzle-orm'
   Pattern: .where(gt(table.column, value))
   
   For descending sort: import { desc } from 'drizzle-orm'
   Pattern: .orderBy(desc(table.column)) */

/* -----------------------------------------------------
   ANSWER SPACE 1
   -----------------------------------------------------
   SQL: SELECT id, name FROM products WHERE stock > 0 ORDER BY price DESC LIMIT 5; */
export const query1 = () => {
  // Write your Drizzle code here
}

/* =====================================================
   QUERY 2
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 2
   -----------------------------------------------------
   Count how many orders exist for each status (paid, pending, etc.)
   and show the results sorted by count from highest to lowest. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 2
   -----------------------------------------------------
   Use aggregation functions from 'drizzle-orm'.
   Import: import { count } from 'drizzle-orm'
   Pattern: .select({ alias: count() })
   
   Group by: .groupBy(table.column)
   
   Chain: .from() → .groupBy() → .orderBy() */

/* -----------------------------------------------------
   ANSWER SPACE 2
   -----------------------------------------------------
   SQL: SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status ORDER BY cnt DESC; */
export const query2 = () => {
  // Write your Drizzle code here
}

/* =====================================================
   QUERY 3
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 3
   -----------------------------------------------------
   Find product categories where the average price is over $100.
   Only include products that belong to a category (ignore uncategorized
   products). Show the category_id and average_price, sorted by
   average price from highest to lowest. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 3
   -----------------------------------------------------
   Combine multiple techniques:
   - WHERE with isNotNull() for NULL filtering
   - GROUP BY for aggregation groups
   - HAVING with gt() for group filtering
   - AVG() for average calculation
   
   Import: import { avg, gt, isNotNull } from 'drizzle-orm'
   
   HAVING pattern: .having(gt(avg(table.column), value))
   
   Full chain: .from() → .where() → .groupBy() → .having() → .orderBy() */

/* -----------------------------------------------------
   ANSWER SPACE 3
   -----------------------------------------------------
   SQL: SELECT category_id, AVG(price) AS avg_price FROM products 
        WHERE category_id IS NOT NULL 
        GROUP BY category_id 
        HAVING AVG(price) > 100 
        ORDER BY avg_price DESC; */
export const query3 = () => {
  // Write your Drizzle code here
}

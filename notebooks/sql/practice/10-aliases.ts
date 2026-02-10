import { desc, eq } from 'drizzle-orm'
import { db } from '../src/drizzle/db'
import { users, products, orders } from '../src/drizzle/schema'

/* =====================================================
   QUERY 1
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 1
   -----------------------------------------------------
   Your manager needs a user report for the marketing team.
   They want to see user IDs and emails, but the column headers
   should say "user_id" and "user_email" instead of just "id" and "email". */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 1
   -----------------------------------------------------
   In Drizzle, column aliases use an object in .select().
   The key is your alias name, the value is the column reference.
   Pattern: .select({ aliasName: table.columnName }) */

/* -----------------------------------------------------
   ANSWER SPACE 1
   -----------------------------------------------------
   SQL: SELECT id AS user_id, email AS user_email FROM users; */
export const query1 = () => {
  // Write your Drizzle code here
  return db.select({ user_id: users.id, user_email: users.email }).from(users)
}

/* =====================================================
   QUERY 2
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 2
   -----------------------------------------------------
   You're writing a product catalog query and want to make it
   cleaner by giving the products table the alias "p". Show the
   product ID, name, and price (using the alias prefix), sorted by
   price from highest to lowest. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 2
   -----------------------------------------------------
   Use .orderBy() with desc() from 'drizzle-orm' for sorting.
   Import: import { desc } from 'drizzle-orm'
   Pattern: .orderBy(desc(table.column))
   
   Note: Drizzle handles table references directly - no need for
   SQL-style "p.id" syntax, just use products.id */

/* -----------------------------------------------------
   ANSWER SPACE 2
   -----------------------------------------------------
   SQL: SELECT p.id, p.name, p.price FROM products AS p ORDER BY p.price DESC; */
export const query2 = () => {
  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
    })
    .from(products)
    .orderBy(desc(products.price))
}

/* =====================================================
   QUERY 3
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 3
   -----------------------------------------------------
   The accounting team needs a report of paid orders. They want to see
   the order ID, total amount, and status from the orders table, but
   rename "id" to "order_id" and "total_amount" to "total". Alias the
   orders table as "o", reference all columns using the alias prefix,
   and filter for only orders where status equals 'paid'. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 3
   -----------------------------------------------------
   Combine .select() with object aliases and .where() with eq().
   Import eq from 'drizzle-orm' for equality checks.
   Pattern: .where(eq(table.column, value))
   
   Both techniques work together in the same query chain. */

/* -----------------------------------------------------
   ANSWER SPACE 3
   -----------------------------------------------------
   SQL: SELECT o.id AS order_id, o.total_amount AS total, o.status FROM orders AS o WHERE o.status = 'paid'; */
export const query3 = () => {
  return db
    .select({
      order_id: orders.id,
      total: orders.totalAmount,
      status: orders.status,
    })
    .from(orders)
    .where(eq(orders.status, 'paid'))
}

import { eq, sql } from 'drizzle-orm'
import { db } from '../src/drizzle/db'
import { products, orderItems, orders } from '../src/drizzle/schema'

/* =====================================================
   QUERY 1
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 1
   -----------------------------------------------------
   The warehouse team wants to see the inventory value
   for each product (price multiplied by stock). Show the
   product ID, price, stock, and calculate the inventory value. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 1
   -----------------------------------------------------
   In Drizzle, calculations in SELECT use the sql`` template tag.
   Import: import { sql } from 'drizzle-orm'
   Pattern: .select({ alias: sql`${table.column1} * ${table.column2}` })
   
   The sql tag lets you write raw SQL expressions while keeping
   type safety. For simple column references, just use the column. */

/* -----------------------------------------------------
   ANSWER SPACE 1
   -----------------------------------------------------
   SQL: SELECT id, price, stock, (price * stock) AS inventory_value FROM products; */
export const query1 = () => {
  // Write your Drizzle code here
  return db
    .select({
      id: products.id,
      price: products.price,
      stock: products.stock,
      inventoryValue: sql`${products.price} * ${products.stock}`,
    })
    .from(products)
}

/* =====================================================
   QUERY 2
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 2
   -----------------------------------------------------
   The finance team needs to calculate line totals for
   each order item (quantity multiplied by price). Show the
   order item ID, quantity, price, and the calculated line total. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 2
   -----------------------------------------------------
   Same pattern as Query 1 - use sql`` for calculations.
   Remember: orderItems table uses camelCase (quantity, price).
   The column names in the schema match the SQL table structure.
   
   Pattern remains: sql`${table.column1} * ${table.column2}` */

/* -----------------------------------------------------
   ANSWER SPACE 2
   -----------------------------------------------------
   SQL: SELECT id, quantity, price, (quantity * price) AS line_total FROM order_items; */
export const query2 = () => {
  return db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      lineTotal: sql`${orderItems.quantity} * ${orderItems.price}`,
    })
    .from(orderItems)
}

/* =====================================================
   QUERY 3
   ===================================================== */

/* -----------------------------------------------------
   QUESTION 3
   -----------------------------------------------------
   The accounting team needs to show orders with an 18%
   tax added to the total amount. Show the order ID,
   original total_amount, and calculate total_with_tax
   for paid orders only. */

/* -----------------------------------------------------
   DRIZZLE CONCEPTS 3
   -----------------------------------------------------
   Combine three techniques: column selection, calculation with sql``,
   and filtering with .where().
   
   For filtering: import { eq } from 'drizzle-orm'
   Pattern: .where(eq(table.column, 'value'))
   
   For the calculation: sql`${table.totalAmount} * 1.18` */

/* -----------------------------------------------------
   ANSWER SPACE 3
   -----------------------------------------------------
   SQL: SELECT id, total_amount, (total_amount * 1.18) AS total_with_tax 
        FROM orders WHERE status = 'paid'; */
export const query3 = () => {
  return db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      totalWithTax: sql`${orders.totalAmount} * 1.18`,
    })
    .from(orders)
    .where(eq(orders.status, 'paid'))
}

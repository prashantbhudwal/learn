# SQL Learning Curriculum - Progress Checklist

A practical path from `SELECT` basics → analytics → joins → safe data changes → performance.

## How to use this

- Pick one SQL dialect for the first pass (examples below are SQLite-first; adjust a few statements if you’re on Postgres/MySQL)
- For each lesson, write 5–10 queries, then rewrite 1–2 to be more readable (aliases, formatting)
- Definition of done: you can predict the result set (rows + columns) before you run the query

Examples assume this minimal schema (rename columns if yours differ):

- `users` (`id`, `email`, `first_name`, `last_name`, `created_at`)
- `categories` (`id`, `name`, `description`)
- `products` (`id`, `name`, `category_id`, `price`, `stock`, `created_at`)
- `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`)
- `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`)

SQLite note: `EXPLAIN QUERY PLAN` is SQLite-specific (Postgres/MySQL typically use `EXPLAIN`).

---

## Query Basics (Finish the core)

Outcome: write readable everyday `SELECT` queries with filters, sorting, and limits.

- [x] **Lesson 1: Basic `SELECT`** - Retrieve all data from a table
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT * FROM users;`
    2. `SELECT * FROM products;`
    3. `SELECT * FROM orders;`

- [x] **Lesson 2: Specific columns** - Choose which columns to display
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, email FROM users;`
    2. `SELECT id, name, price FROM products;`
    3. `SELECT id, user_id, total_amount, status FROM orders;`

- [x] **Lesson 3: `WHERE` with numbers** - Filter with comparison operators (`>`, `<`, `>=`, `<=`)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, price FROM products WHERE price > 100;`
    2. `SELECT id, name, stock FROM products WHERE stock <= 5;`
    3. `SELECT id, order_id, product_id, quantity FROM order_items WHERE quantity >= 3;`

- [x] **Lesson 4: `WHERE` with text** - Filter with exact matches (`=`)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, email FROM users WHERE email = 'alice@example.com';`
    2. `SELECT id, total_amount FROM orders WHERE status = 'pending';`
    3. `SELECT id, name, description FROM categories WHERE name = 'Electronics';`

- [x] **Lesson 5: `AND` operator** - Combine multiple conditions (all must be true)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, price FROM products WHERE price > 100 AND stock > 0;`
    2. `SELECT id, user_id, total_amount FROM orders WHERE status = 'paid' AND total_amount >= 500;`
    3. `SELECT id, name, price, stock FROM products WHERE category_id = 1 AND price < 50 AND stock >= 10;`

- [x] **Lesson 6: `ORDER BY`** - Sort results (`ASC`/`DESC`)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, price FROM products ORDER BY price ASC;`
    2. `SELECT id, user_id, total_amount FROM orders ORDER BY total_amount DESC;`
    3. `SELECT id, email, created_at FROM users ORDER BY created_at DESC;`

- [x] **Lesson 7: `LIMIT`** - Restrict number of results
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, price FROM products LIMIT 5;`
    2. `SELECT id, user_id, total_amount FROM orders ORDER BY total_amount DESC LIMIT 10;`
    3. `SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 3;`

- [x] **Lesson 8: `OR` operator** - Either condition works
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, stock FROM products WHERE stock = 0 OR stock IS NULL;`
    2. `SELECT id, user_id, status FROM orders WHERE status = 'pending' OR status = 'failed';`
    3. `SELECT id, name, price FROM products WHERE category_id = 1 OR price < 25;`

- [x] **Lesson 9: `DISTINCT`** - Remove duplicates (unique values)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT DISTINCT status FROM orders;`
    2. `SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL;`
    3. `SELECT COUNT(DISTINCT user_id) AS unique_customers FROM orders;`

- [x] **Lesson 10: Aliases (`AS`)** - Rename columns/tables for readability
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id AS user_id, email AS user_email FROM users;`
    2. `SELECT p.id, p.name, p.price FROM products AS p ORDER BY p.price DESC;`
    3. `SELECT o.id AS order_id, o.total_amount AS total, o.status FROM orders AS o WHERE o.status = 'paid';`

- [x] **Lesson 10: Aliases (`AS`)** - Rename columns/tables for readability
  - [x] SQL
  - [x] Drizzle

- [x] **Lesson 11: Expressions** - Calculations in `SELECT` (e.g. `quantity * price`)
  - [x] SQL
  - [x] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, price, stock, (price * stock) AS inventory_value FROM products;`
    2. `SELECT id, quantity, price, (quantity * price) AS line_total FROM order_items;`
    3. `SELECT id, total_amount, (total_amount * 1.18) AS total_with_tax FROM orders WHERE status = 'paid';`

- [ ] **Lesson 12: SQL execution order** - `FROM` → `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name FROM products WHERE stock > 0 ORDER BY price DESC LIMIT 5;`
    2. `SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status ORDER BY cnt DESC;`
    3. `SELECT category_id, AVG(price) AS avg_price FROM products WHERE category_id IS NOT NULL GROUP BY category_id HAVING AVG(price) > 100 ORDER BY avg_price DESC;`

Bonus (optional, but saves headaches later):

- [ ] **Bonus: Parentheses + precedence** - `AND` binds tighter than `OR`; use parentheses to be explicit
  - Outcomes (expected queries):
    1. `SELECT id, name FROM products WHERE category_id = 1 OR category_id = 2;`
    2. `SELECT id, name, price, stock FROM products WHERE (category_id = 1 OR category_id = 2) AND stock > 0;`
    3. `SELECT id, name FROM products WHERE (price < 25 OR stock > 50) AND category_id IS NOT NULL;`

- [ ] **Bonus: `LIMIT` + `OFFSET`** - Simple pagination
  - Outcomes (expected queries):
    1. `SELECT id, name FROM products ORDER BY id LIMIT 10 OFFSET 0;`
    2. `SELECT id, name FROM products ORDER BY id LIMIT 10 OFFSET 10;`
    3. `SELECT id, name, price FROM products WHERE stock > 0 ORDER BY price DESC LIMIT 10 OFFSET 20;`

Checkpoint: write a “products list” query with filters + sorting + pagination.

---

## Data Analysis & Aggregation

Outcome: answer “how many / how much / what’s the top …” questions.

- [ ] **Lesson 13: `COUNT()`** - `COUNT(*)`, `COUNT(col)`, `COUNT(DISTINCT col)`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT COUNT(*) AS total_orders FROM orders;`
    2. `SELECT COUNT(created_at) AS orders_with_timestamp FROM orders;`
    3. `SELECT COUNT(DISTINCT user_id) AS customers_who_ordered FROM orders;`

- [ ] **Lesson 14: `SUM()` and `AVG()`** - Totals and averages
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT SUM(total_amount) AS revenue FROM orders WHERE status = 'paid';`
    2. `SELECT AVG(total_amount) AS avg_order_value FROM orders WHERE status = 'paid';`
    3. `SELECT order_id, SUM(quantity * price) AS computed_total FROM order_items GROUP BY order_id;`

- [ ] **Lesson 15: `MIN()` and `MAX()`** - Find extremes
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;`
    2. `SELECT MIN(total_amount) AS smallest, MAX(total_amount) AS largest FROM orders WHERE status = 'paid';`
    3. `SELECT product_id, MIN(price) AS min_paid, MAX(price) AS max_paid FROM order_items GROUP BY product_id;`

- [ ] **Lesson 16: `GROUP BY`** - Group rows for aggregation
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status;`
    2. `SELECT category_id, COUNT(*) AS products_in_category FROM products GROUP BY category_id;`
    3. `SELECT product_id, SUM(quantity) AS units_sold FROM order_items GROUP BY product_id;`

- [ ] **Lesson 17: `HAVING`** - Filter grouped results
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status HAVING COUNT(*) >= 5;`
    2. `SELECT product_id, SUM(quantity) AS units_sold FROM order_items GROUP BY product_id HAVING SUM(quantity) >= 10;`
    3. `SELECT user_id, COUNT(*) AS orders_count FROM orders GROUP BY user_id HAVING COUNT(*) >= 3 ORDER BY orders_count DESC;`

- [ ] **Lesson 18: `GROUP BY` (multiple columns)** - Group by more than one field
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT status, user_id, COUNT(*) AS cnt FROM orders GROUP BY status, user_id;`
    2. `SELECT order_id, product_id, SUM(quantity) AS qty FROM order_items GROUP BY order_id, product_id;`
    3. `SELECT category_id, (price >= 100) AS expensive_bucket, COUNT(*) AS cnt FROM products GROUP BY category_id, (price >= 100);`

- [ ] **Lesson 19: Aggregation patterns** - Top-N per group (without window functions yet)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT product_id, SUM(quantity * price) AS revenue FROM order_items GROUP BY product_id ORDER BY revenue DESC LIMIT 10;` 2. `SELECT category_id, COUNT(*) AS products_count FROM products GROUP BY category_id ORDER BY products_count DESC LIMIT 5;` 3. `SELECT p.category_id, p.id AS product_id, SUM(oi.quantity * oi.price) AS revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.category_id, p.id
ORDER BY p.category_id, revenue DESC;`

Checkpoint: find top 10 products by revenue.

---

## Advanced Filtering Toolkit

Outcome: express real-world filters safely (especially around `NULL`).

- [ ] **Lesson 20: `BETWEEN`** - Range queries
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, price FROM products WHERE price BETWEEN 10 AND 50;`
    2. `SELECT id, total_amount FROM orders WHERE total_amount BETWEEN 100 AND 500;`
    3. `SELECT id, name, created_at FROM products WHERE created_at BETWEEN '2026-01-01' AND '2026-02-01';`

- [ ] **Lesson 21: `IN` operator** - Match from a list of values
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name FROM categories WHERE name IN ('Electronics', 'Books');`
    2. `SELECT id, user_id, status FROM orders WHERE status IN ('paid', 'shipped');`
    3. `SELECT id, name, price FROM products WHERE category_id IN (1, 2, 3) AND stock > 0;`

- [ ] **Lesson 22: `LIKE` and wildcards** - Pattern matching (`%` and `_`)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, email FROM users WHERE email LIKE '%@gmail.com';`
    2. `SELECT id, name FROM products WHERE name LIKE '%Pro%';`
    3. `SELECT id, first_name, last_name FROM users WHERE first_name LIKE 'A_%' OR last_name LIKE 'S%';`

- [ ] **Lesson 23: `NULL` handling** - `IS NULL` / `IS NOT NULL`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name FROM products WHERE category_id IS NULL;`
    2. `SELECT id, name FROM categories WHERE description IS NULL;`
    3. `SELECT id, name, category_id FROM products WHERE category_id IS NOT NULL AND stock > 0;`

- [ ] **Lesson 24: `COALESCE` (and `IFNULL`)** - Fallback values for `NULL` (dialect differences)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT id, name, COALESCE(description, '(no description)') AS description FROM categories;`
    2. `SELECT id, name, COALESCE(category_id, -1) AS category_id_safe FROM products;`
    3. `SELECT id, name, COALESCE(stock, 0) AS stock_safe FROM products WHERE COALESCE(stock, 0) = 0;`

- [ ] **Lesson 25: `CASE` (intro)** - Conditional logic in query output
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT id, total_amount,
      CASE WHEN total_amount >= 500 THEN 'large' ELSE 'normal' END AS size
FROM orders;` 2. `SELECT id, name, stock,
      CASE WHEN stock = 0 THEN 'out' WHEN stock < 5 THEN 'low' ELSE 'ok' END AS stock_status
FROM products;` 3. `SELECT id, status,
      CASE status
        WHEN 'pending' THEN 1
        WHEN 'paid' THEN 2
        WHEN 'shipped' THEN 3
        ELSE 99
      END AS status_rank
FROM orders;`

Checkpoint: build a search query that handles missing values (`NULL`) correctly.

---

## Joins (E-commerce style schema)

Outcome: combine tables without accidentally duplicating rows.

- [ ] **Lesson 26: `INNER JOIN`** - Match rows across tables
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT o.id, o.total_amount, u.email FROM orders o JOIN users u ON u.id = o.user_id;`
    2. `SELECT p.id, p.name, c.name AS category FROM products p JOIN categories c ON c.id = p.category_id;`
    3. `SELECT oi.id, oi.order_id, p.name, oi.quantity FROM order_items oi JOIN products p ON p.id = oi.product_id;`

- [ ] **Lesson 27: `LEFT JOIN`** - Keep all rows from the left table
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `SELECT u.id, u.email, o.id AS order_id FROM users u LEFT JOIN orders o ON o.user_id = u.id;`
    2. `SELECT c.id, c.name, p.id AS product_id FROM categories c LEFT JOIN products p ON p.category_id = c.id;`
    3. `SELECT p.id, p.name, oi.id AS order_item_id FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id;`

- [ ] **Lesson 28: Join conditions (`ON` vs `WHERE`)** - Avoid accidental filtering
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email, o.status FROM users u LEFT JOIN orders o ON o.user_id = u.id;` 2. `SELECT u.id, u.email, o.status
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid';` 3. `SELECT u.id, u.email, o.status
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid';`

- [ ] **Lesson 29: Joining 3 tables** - `orders` → `users` → `order_items`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT o.id AS order_id, u.email
FROM orders o
JOIN users u ON u.id = o.user_id;` 2. `SELECT o.id AS order_id, u.email, oi.product_id, oi.quantity
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id;` 3. `SELECT o.id AS order_id, u.email, COUNT(oi.id) AS line_items
FROM orders o
JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.email;`

- [ ] **Lesson 30: Joining 4 tables** - `orders` → `order_items` → `products` → `categories`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT o.id AS order_id, p.name AS product_name, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id;` 2. `SELECT o.id AS order_id, c.name AS category, p.name AS product_name, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
LEFT JOIN categories c ON c.id = p.category_id;` 3. `SELECT c.name AS category, SUM(oi.quantity * oi.price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
LEFT JOIN categories c ON c.id = p.category_id
GROUP BY c.name
ORDER BY revenue DESC;`

- [ ] **Lesson 31: Self join** - Join a table to itself (optional in this schema)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT p1.id, p1.name, p2.id, p2.name
FROM products p1
JOIN products p2 ON p1.category_id = p2.category_id
WHERE p1.id < p2.id;` 2. `SELECT p1.name AS product_a, p2.name AS product_b, p1.category_id
FROM products p1
JOIN products p2 ON p1.category_id = p2.category_id
WHERE p1.id < p2.id AND p1.category_id IS NOT NULL;` 3. `SELECT p1.category_id, COUNT(*) AS pair_count
FROM products p1
JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id
GROUP BY p1.category_id
ORDER BY pair_count DESC;`

- [ ] **Lesson 32: Anti-joins** - Find missing relationships
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;` 2. `SELECT p.id, p.name
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.id IS NULL;` 3. `SELECT c.id, c.name
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE p.id IS NULL;`

- [ ] **Lesson 33: Aggregations + joins** - Core analytics
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email, COUNT(o.id) AS orders_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
ORDER BY orders_count DESC;` 2. `SELECT p.id, p.name, SUM(oi.quantity) AS units_sold
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY units_sold DESC
LIMIT 10;` 3. `SELECT o.id AS order_id,
      u.email,
      SUM(oi.quantity) AS total_items,
      SUM(oi.quantity * oi.price) AS computed_total
FROM orders o
JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.email
ORDER BY o.id;`

Checkpoint: produce a one-row-per-order report (order_id, user, total_items, total_amount).

---

## Subqueries, CTEs, and Set Operations

Outcome: write clean multi-step queries and compare approaches.

- [ ] **Lesson 34: Subqueries (basics)** - Scalar + table subqueries
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT p.*
FROM products p
WHERE p.price > (SELECT AVG(price) FROM products);` 2. `SELECT *
FROM orders
WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@gmail.com');` 3. `SELECT p.id, p.name
FROM products p
WHERE p.id IN (
  SELECT oi.product_id
  FROM order_items oi
  GROUP BY oi.product_id
  HAVING SUM(oi.quantity) >= 10
);`

- [ ] **Lesson 35: Correlated subqueries** - Subquery depends on outer row
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);` 2. `SELECT p.id, p.name
FROM products p
WHERE (SELECT SUM(oi.quantity)
       FROM order_items oi
       WHERE oi.product_id = p.id) > 10;` 3. `SELECT o.id, o.user_id, o.total_amount
FROM orders o
WHERE o.total_amount > (
  SELECT AVG(o2.total_amount)
  FROM orders o2
  WHERE o2.user_id = o.user_id
);`

- [ ] **Lesson 36: `EXISTS`** - Check if related rows exist
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);` 2. `SELECT p.id, p.name
FROM products p
WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);` 3. `SELECT c.id, c.name
FROM categories c
WHERE EXISTS (
  SELECT 1
  FROM products p
  WHERE p.category_id = c.id AND p.stock > 0
);`

- [ ] **Lesson 37: `IN` vs `EXISTS`** - Practical differences
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT u.id, u.email
FROM users u
WHERE u.id IN (SELECT o.user_id FROM orders o);` 2. `SELECT u.id, u.email
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);` 3. `SELECT p.id, p.name
FROM products p
WHERE EXISTS (
  SELECT 1
  FROM order_items oi
  WHERE oi.product_id = p.id
  GROUP BY oi.product_id
  HAVING SUM(oi.quantity) >= 10
);`

- [ ] **Lesson 38: `UNION` vs `UNION ALL`** - Combine result sets
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT email AS identifier FROM users
UNION
SELECT status AS identifier FROM orders;` 2. `SELECT status FROM orders WHERE status = 'paid'
UNION ALL
SELECT status FROM orders WHERE status = 'paid';` 3. `SELECT id, created_at, 'user' AS entity FROM users
UNION ALL
SELECT id, created_at, 'order' AS entity FROM orders
ORDER BY created_at DESC;`

- [ ] **Lesson 39: CTEs (`WITH`)** - Clean multi-step queries (great for reports)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `WITH paid_orders AS (
  SELECT id, user_id, total_amount
  FROM orders
  WHERE status = 'paid'
)
SELECT COUNT(*) AS paid_count FROM paid_orders;` 2. `WITH order_totals AS (
  SELECT oi.order_id, SUM(oi.quantity * oi.price) AS computed_total
  FROM order_items oi
  GROUP BY oi.order_id
)
SELECT o.id, o.total_amount, ot.computed_total
FROM orders o
JOIN order_totals ot ON ot.order_id = o.id;` 3. `WITH revenue_by_product AS (
  SELECT oi.product_id, SUM(oi.quantity * oi.price) AS revenue
  FROM order_items oi
  GROUP BY oi.product_id
),
ranked AS (
  SELECT p.id, p.name, rbp.revenue
  FROM products p
  JOIN revenue_by_product rbp ON rbp.product_id = p.id
)
SELECT * FROM ranked ORDER BY revenue DESC LIMIT 10;`

Checkpoint: rewrite a complex join query into a 2–3 step CTE.

---

## Modifying Data (Safe CRUD + consistency with `order_items`)

Outcome: change data without surprises.

- [ ] **Lesson 40: `INSERT` (single table)** - Add `users`/`products`/`categories`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `INSERT INTO categories (name, description) VALUES ('Books', 'Printed and digital books');`
    2. `INSERT INTO users (email, first_name, last_name) VALUES ('sam@example.com', 'Sam', 'Khan');`
    3. `INSERT INTO products (name, category_id, price, stock) VALUES ('Notebook', 1, 9.99, 100);`

- [ ] **Lesson 41: `INSERT` (parent + child)** - Create `orders` + insert `order_items`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `INSERT INTO orders (user_id, total_amount, status) VALUES (1, 0, 'pending');` 2. `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (1, 2, 3, 19.99);` 3. `INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 1, p.id, 1, p.price FROM products p WHERE p.id IN (2, 3);`

- [ ] **Lesson 42: `UPDATE` (safe `WHERE`)** - Update prices/stock/status safely
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `UPDATE products SET stock = stock - 1 WHERE id = 2;` 2. `UPDATE orders SET status = 'paid' WHERE id = 1 AND status = 'pending';` 3. `UPDATE products
SET price = price * 1.10
WHERE category_id = (SELECT id FROM categories WHERE name = 'Electronics');`

- [ ] **Lesson 43: `DELETE` (safe `WHERE`)** - Delete with care (and understand FK impact)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `DELETE FROM order_items WHERE id = 10;` 2. `DELETE FROM orders WHERE id = 1 AND status = 'pending';` 3. `DELETE FROM products
WHERE id IN (
  SELECT p.id
  FROM products p
  LEFT JOIN order_items oi ON oi.product_id = p.id
  WHERE oi.id IS NULL
);`

- [ ] **Lesson 44: Transactions** - `BEGIN` / `COMMIT` / `ROLLBACK`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `BEGIN;`
    2. `UPDATE products SET stock = stock - 2 WHERE id = 2;`
    3. `ROLLBACK;`

- [ ] **Lesson 45: Constraints (basics)** - `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK` (light intro)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `INSERT INTO categories (name) VALUES ('Books'); -- should fail if Books already exists (UNIQUE)`
    2. `INSERT INTO orders (user_id, total_amount) VALUES (999999, 10.00); -- should fail if FK enforced`
    3. `INSERT INTO users (email, first_name, last_name) VALUES ('x@example.com', NULL, 'Y'); -- should fail (NOT NULL)`

Checkpoint: do a multi-step change inside a transaction and verify rollback works.

---

## Performance & Reuse

Outcome: reason about speed and reuse queries safely.

- [ ] **Lesson 46: Indexes (why/when)** - Speed up joins and filters
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries):
    1. `CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`
    2. `CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`
    3. `CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);`

- [ ] **Lesson 47: `EXPLAIN` / query plans (basics)** - How the database executes queries
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `EXPLAIN QUERY PLAN SELECT * FROM orders WHERE user_id = 1;` 2. `EXPLAIN QUERY PLAN SELECT * FROM order_items WHERE order_id = 1;` 3. `EXPLAIN QUERY PLAN
SELECT p.id, p.name, SUM(oi.quantity) AS units_sold
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name;`

- [ ] **Lesson 48: Views** - Saved queries for reuse (reporting layer)
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `CREATE VIEW IF NOT EXISTS v_paid_orders AS SELECT * FROM orders WHERE status = 'paid';` 2. `SELECT * FROM v_paid_orders ORDER BY created_at DESC LIMIT 20;` 3. `CREATE VIEW IF NOT EXISTS v_revenue_by_product AS
SELECT oi.product_id, SUM(oi.quantity * oi.price) AS revenue
FROM order_items oi
GROUP BY oi.product_id;`

Checkpoint: compare a query plan before/after adding an index.

---

## Optional (Very useful for analytics)

Outcome: advanced reporting patterns.

- [ ] **Lesson 49: Window functions (intro)** - `ROW_NUMBER()`, `RANK()`, `SUM(x) OVER (...)`
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `SELECT o.*, ROW_NUMBER() OVER (ORDER BY o.created_at) AS rn FROM orders o;` 2. `SELECT p.id, p.name, SUM(oi.quantity * oi.price) AS revenue,
      RANK() OVER (ORDER BY SUM(oi.quantity * oi.price) DESC) AS revenue_rank
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name;` 3. `SELECT o.id, o.user_id, o.total_amount,
      SUM(o.total_amount) OVER (PARTITION BY o.user_id ORDER BY o.created_at) AS running_spend
FROM orders o;`

- [ ] **Lesson 50: Window functions (practical)** - Top-N per category, running totals, cohorts-lite
  - [ ] SQL
  - [ ] Drizzle
  - Outcomes (expected queries): 1. `WITH rev AS (
  SELECT p.category_id, p.id AS product_id, p.name,
         SUM(oi.quantity * oi.price) AS revenue
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  GROUP BY p.category_id, p.id, p.name
),
ranked AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY revenue DESC) AS rn
  FROM rev
)
SELECT * FROM ranked WHERE rn <= 3 ORDER BY category_id, revenue DESC;` 2. `SELECT o.id, DATE(o.created_at) AS day,
      SUM(o.total_amount) OVER (ORDER BY DATE(o.created_at)) AS running_revenue
FROM orders o
WHERE o.status = 'paid'
ORDER BY day;` 3. `WITH first_order AS (
  SELECT user_id, MIN(DATE(created_at)) AS first_day
  FROM orders
  WHERE status = 'paid'
  GROUP BY user_id
)
SELECT first_day, COUNT(*) AS new_customers
FROM first_order
GROUP BY first_day
ORDER BY first_day;`

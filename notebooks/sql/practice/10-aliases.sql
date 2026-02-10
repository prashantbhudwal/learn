-- =====================================================
-- LESSON 10: Aliases (AS) - Readable Column Names
-- =====================================================


-- =====================================================
-- QUERY 1
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 1
-- -----------------------------------------------------
-- Your manager needs a user report for the marketing team.
-- They want to see user IDs and emails, but the column headers
-- should say "user_id" and "user_email" instead of just "id" and "email".

-- -----------------------------------------------------
-- CONCEPTS 1
-- -----------------------------------------------------
-- Aliases let you rename columns in your query output. This doesn't
-- change the database - it just makes the results more readable.
-- Use the AS keyword: SELECT column_name AS new_name

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 1
-- -----------------------------------------------------
-- Marketing is asking for a user export, which means this data is likely
-- going into a CSV for some campaign tool or CRM. When I see "id" and
-- "email" as column headers in their export, it's going to create confusion
-- downstream - is that the user ID, order ID, or campaign ID? The alias
-- "user_id" removes that ambiguity entirely.
--
-- I'm being deliberate about not using SELECT *. In a production table
-- with 20+ columns including PII like phone numbers or addresses, pulling
-- everything would be wasteful and potentially a compliance issue if
-- marketing doesn't need that data. Better to be explicit about what
-- fields I'm exposing.
--
-- The naming convention here matters more than it seems. If I alias
-- id as just "uid" or "userId", it might confuse the data team who
-- expect snake_case in our warehouse. "user_id" matches our established
-- patterns. Also worth noting - I could omit the AS keyword entirely
-- and just do "id user_id", but that's harder to grep for when someone
-- is debugging six months from now. Explicit is better than implicit.

-- -----------------------------------------------------
-- ANSWER SPACE 1
-- -----------------------------------------------------

select id as user_id, email as user_email from users




-- =====================================================
-- QUERY 2
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 2
-- -----------------------------------------------------
-- You're writing a product catalog query and want to make it
-- cleaner by giving the products table the alias "p". Show the
-- product ID, name, and price (using the alias prefix), sorted by
-- price from highest to lowest.

-- -----------------------------------------------------
-- CONCEPTS 2
-- -----------------------------------------------------
-- You can also give tables shorter names to make queries cleaner.
-- Use: FROM table_namere AS alias
-- Then reference columns with: alias.column_name

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 2
-- -----------------------------------------------------
-- The requirement mentions a "product catalog" with sorting by price
-- descending. This is almost certainly for an e-commerce frontend or
-- API endpoint. Using a table alias here isn't just about saving
-- keystrokes - it's about query maintainability.
--
-- I've seen too many simple queries that start as single-table SELECTs
-- and then get modified two sprints later to join with inventory or
-- pricing tables. When that happens, having existing column references
-- like "p.name" instead of just "name" makes the refactoring trivial.
-- Without the prefix, suddenly "name" becomes ambiguous between
-- products.name and categories.name.
--
-- Using 'p' as the alias is consistent with our team's conventions,
-- though I've worked at places that prefer the full "prod" prefix.
-- The ORDER BY p.price DESC is interesting - DESC is explicit here
-- rather than relying on the default. That tells me whoever wrote
-- this requirement has been burned by implicit sorting before.
--
-- One subtle thing: the query selects id, name, price but doesn't
-- include stock. If this is truly a catalog for customers, maybe
-- we should be filtering out-of-stock items? Or is this for
-- merchandising where they want to see everything? Worth asking.

-- -----------------------------------------------------
-- ANSWER SPACE 2
-- -----------------------------------------------------

select p.id, p.name, p.price  from products as p order by p.price desc



-- =====================================================
-- QUERY 3
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 3
-- -----------------------------------------------------
-- The accounting team needs a report of paid orders. They want to see
-- the order ID, total amount, and status from the orders table, but
-- rename "id" to "order_id" and "total_amount" to "total". Alias the
-- orders table as "o", reference all columns using the alias prefix,
-- and filter for only orders where status equals 'paid'.

-- -----------------------------------------------------
-- CONCEPTS 3
-- -----------------------------------------------------
-- Combine both techniques: alias the table for shorter references,
-- and alias the columns for better readability in reports.
-- Pattern: SELECT alias.column AS new_name FROM table AS alias

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 3
-- -----------------------------------------------------
-- Accounting needs a report of paid orders with renamed columns. This
-- is likely going into a financial export or reconciliation process.
-- The request to rename "id" to "order_id" tells me they're probably
-- importing this into a system that has multiple ID columns and needs
-- clear naming to avoid column collisions.
--
-- Using 'o' as the table alias is straightforward, but I'm thinking
-- about the WHERE clause. Filtering by status = 'paid' assumes that
-- the status column uses exact string matching. In some systems,
-- status might be an enum or have different casing conventions. I
-- should verify that 'paid' is the correct value and not 'PAID' or
-- 'completed' or something else.
--
-- The column alias "total" for "total_amount" is interesting. They're
-- asking to shorten it, which suggests they want compact headers,
-- probably for a spreadsheet where column width matters. But "total"
-- is a pretty generic term - if this gets joined with other data
-- later, "total" might become ambiguous. For now, it's fine, but
-- I'd push back if they asked for just "t" or single-letter aliases.
--
-- One thing I'd double-check: does "paid" mean fully paid, or could
-- there be partial payments with status = 'partially_paid'? Accounting
-- requirements are usually precise about these distinctions, so I
-- want to make sure I'm capturing exactly what they need.

-- -----------------------------------------------------
-- ANSWER SPACE 3
-- -----------------------------------------------------

select o.id as order_id, o.total_amount as total, o.status from orders as o where o.status = 'paid' 


-- When you're done, run: bun run sql

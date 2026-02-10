-- =====================================================
-- DUMMY: Many Queries Example
-- =====================================================
-- This file shows what a real-world SQL file looks like
-- with multiple queries (not just 3 learning queries)


-- =====================================================
-- QUERY 1: Basic Select
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 1
-- -----------------------------------------------------
-- Get all users

-- -----------------------------------------------------
-- CONCEPTS 1
-- -----------------------------------------------------
-- SELECT * retrieves all columns

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 1
-- -----------------------------------------------------
-- This is just a basic query to see all users

-- -----------------------------------------------------
-- ANSWER SPACE 1
-- -----------------------------------------------------

select * from users



-- =====================================================
-- QUERY 2: Count Users
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 2
-- -----------------------------------------------------
-- How many users do we have?

-- -----------------------------------------------------
-- CONCEPTS 2
-- -----------------------------------------------------
-- COUNT(*) counts all rows

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 2
-- -----------------------------------------------------
-- Simple aggregation to get user count

-- -----------------------------------------------------
-- ANSWER SPACE 2
-- -----------------------------------------------------

select count(*) as user_count from users



-- =====================================================
-- QUERY 3: Active Products
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 3
-- -----------------------------------------------------
-- Show products that are in stock

-- -----------------------------------------------------
-- CONCEPTS 3
-- -----------------------------------------------------
-- WHERE filters rows before returning them

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 3
-- -----------------------------------------------------
-- We only want products customers can actually buy

-- -----------------------------------------------------
-- ANSWER SPACE 3
-- -----------------------------------------------------

select id, name, price, stock from products where stock > 0



-- =====================================================
-- QUERY 4: Total Revenue
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 4
-- -----------------------------------------------------
-- Calculate total revenue from all paid orders

-- -----------------------------------------------------
-- CONCEPTS 4
-- -----------------------------------------------------
-- SUM adds up values. WHERE filters which rows to include.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 4
-- -----------------------------------------------------
-- Only paid orders count as real revenue. Pending orders might cancel.

-- -----------------------------------------------------
-- ANSWER SPACE 4
-- -----------------------------------------------------

select sum(total_amount) as total_revenue from orders where status = 'paid'



-- =====================================================
-- QUERY 5: Top Customers
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 5
-- -----------------------------------------------------
-- Find the 3 customers who spent the most money

-- -----------------------------------------------------
-- CONCEPTS 5
-- -----------------------------------------------------
-- GROUP BY aggregates per user. ORDER BY sorts results.
-- LIMIT restricts to top N.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 5
-- -----------------------------------------------------
-- Group orders by user, sum their totals, sort highest first, take top 3.
-- This shows our biggest customers for VIP treatment.

-- -----------------------------------------------------
-- ANSWER SPACE 5
-- -----------------------------------------------------

select user_id, sum(total_amount) as total_spent from orders group by user_id order by total_spent desc limit 3



-- =====================================================
-- QUERY 6: Product Categories with Counts
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 6
-- -----------------------------------------------------
-- List each category and how many products are in it

-- -----------------------------------------------------
-- CONCEPTS 6
-- -----------------------------------------------------
-- JOIN connects tables. GROUP BY aggregates per group.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 6
-- -----------------------------------------------------
-- Join products to categories to get category names.
-- Group by category and count products in each.
-- This shows which categories are well-stocked vs sparse.

-- -----------------------------------------------------
-- ANSWER SPACE 6
-- -----------------------------------------------------

select c.name, count(p.id) as product_count from categories c left join products p on c.id = p.category_id group by c.id, c.name



-- =====================================================
-- QUERY 7: Monthly Sales
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 7
-- -----------------------------------------------------
-- Show how many orders were placed each month

-- -----------------------------------------------------
-- CONCEPTS 7
-- -----------------------------------------------------
-- strftime extracts date parts. GROUP BY aggregates by month.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 7
-- -----------------------------------------------------
-- Extract year-month from created_at, group by that, count orders.
-- This shows sales trends over time.

-- -----------------------------------------------------
-- ANSWER SPACE 7
-- -----------------------------------------------------

select strftime('%Y-%m', created_at) as month, count(*) as order_count from orders group by month order by month



-- When you're done, run: bun run sql

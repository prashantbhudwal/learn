-- =====================================================
-- LESSON 11: Expressions - Calculations in SELECT
-- =====================================================


-- =====================================================
-- QUERY 1
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 1
-- -----------------------------------------------------
-- The warehouse team wants to see the inventory value
-- for each product (price multiplied by stock). Show the
-- product ID, price, stock, and calculate the inventory value.

-- -----------------------------------------------------
-- CONCEPTS 1
-- -----------------------------------------------------
-- SQL can perform calculations on column values in SELECT.
-- Use arithmetic operators: +, -, *, /
-- Pattern: SELECT column1 * column2 AS result_name

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 1
-- -----------------------------------------------------
-- The warehouse team is asking for inventory valuation, which means
-- they're likely preparing for an audit, insurance documentation, or
-- a financial report. Calculating price × stock gives them the total
-- value tied up in each SKU. This is a straightforward multiplication
-- but the alias matters - "inventory_value" is much clearer than
-- letting the database generate a cryptic column name like "?column?".
--
-- I'm selecting all four columns explicitly rather than using SELECT *.
-- This makes the query self-documenting and ensures the order of columns
-- in the output matches what the warehouse expects. If I just did
-- SELECT * and the schema changes later, their reporting might break.
--
-- One consideration: what if stock is NULL? In some databases, NULL
-- multiplied by anything returns NULL, which might confuse the warehouse
-- team. They'd see products with no inventory value when really they
-- just haven't received stock yet. But for now, I'll trust the data
-- quality and proceed with the basic calculation.

-- -----------------------------------------------------
-- ANSWER SPACE 1
-- -----------------------------------------------------

select id, price, stock, price * stock as inventory_value from products



-- =====================================================
-- QUERY 2
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 2
-- -----------------------------------------------------
-- The finance team needs to calculate line totals for
-- each order item (quantity multiplied by price). Show the
-- order item ID, quantity, price, and the calculated line total.

-- -----------------------------------------------------
-- CONCEPTS 2
-- -----------------------------------------------------
-- Calculations work with any numeric columns. The order_items
-- table stores both quantity and price for each line item.
-- Use the same arithmetic pattern with a descriptive alias.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 2
-- -----------------------------------------------------
-- Finance wants line totals, which suggests they're reconciling orders
-- or preparing invoices. The order_items table stores quantity and price
-- at the line level, so this calculation gives them the extended amount
-- for each product on an order. This is standard e-commerce arithmetic.
--
-- I'm wondering if I should be concerned about data consistency here.
-- The price in order_items is the price at time of order, not the
-- current product price. That's actually correct for line totals -
-- historical pricing matters for accurate accounting. If I joined to
-- the products table and used current prices, the math would be wrong
-- for old orders.
--
-- The alias "line_total" is conventional in finance systems. Without it,
-- the column header would be something like "?column?" or the raw
-- expression. That makes the export unusable for their spreadsheet
-- work. Explicit aliasing is always better when the query output
-- leaves the database.

-- -----------------------------------------------------
-- ANSWER SPACE 2
-- -----------------------------------------------------

select id, quantity, price, quantity * price as line_total from order_items



-- =====================================================
-- QUERY 3
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 3
-- -----------------------------------------------------
-- The accounting team needs to show orders with an 18%
-- tax added to the total amount. Show the order ID,
-- original total_amount, and calculate total_with_tax
-- for paid orders only.

-- -----------------------------------------------------
-- CONCEPTS 3
-- -----------------------------------------------------
-- You can multiply by constants (like 1.18 for 18% tax).
-- Combine with WHERE to filter which rows get calculated.
-- Pattern: SELECT column * 1.18 AS taxed_amount FROM table WHERE condition

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 3
-- -----------------------------------------------------
-- Accounting needs to show tax-inclusive totals for paid orders only.
-- The 18% tax rate suggests this might be for a specific jurisdiction
-- or a particular reporting period. Filtering for "paid" status is
-- critical - pending orders haven't actually generated revenue yet,
-- so including them would inflate the tax liability incorrectly.
--
-- I'm calculating total_amount * 1.18 to add the 18% tax. Some might
-- think to do total_amount + (total_amount * 0.18), but that's the
-- same result with more typing. The 1.18 multiplier is cleaner and
-- easier to adjust if the tax rate changes later.
--
-- Showing both the original total and the taxed total is smart -
-- it lets accounting verify the math and catch any discrepancies.
-- If I only showed the taxed amount, they'd have to reverse-calculate
-- to audit the numbers. Including the order_id gives them a reference
-- to tie back to the source transactions.

-- -----------------------------------------------------
-- ANSWER SPACE 3
-- -----------------------------------------------------

select id, total_amount, total_amount * (1.18) as total_with_tax from orders where status = 'paid'



-- When you're done, run: bun run sql

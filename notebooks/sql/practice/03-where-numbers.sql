-- =====================================================
-- LESSON 3: Filtering with WHERE (Numbers)
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Your boss only wants to email people who spent 
-- more than $100. Find all orders where total_amount is 
-- greater than 100.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Getting all rows is often too much. The WHERE clause lets you
-- filter and show only rows that match your criteria.
-- 
-- WHERE comes after FROM. You specify a column, then a comparison
-- operator, then a value. For numbers, operators like > (greater
-- than), < (less than), = (equals), >= (greater or equal) work.
-- 
-- Numbers don't need quotes - just write them directly.
-- Pattern: SELECT * FROM table WHERE column > value

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a targeted marketing query - filtering to high-value customers
-- makes the outreach more efficient. The threshold of $100 is arbitrary
-- but reasonable for identifying engaged customers.
-- 
-- Using > for the comparison makes sense here - we want strictly greater
-- than 100, not equal to it. For ad-hoc analysis like this, SELECT * is
-- fine since we want to see all order details for these qualifying records.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

SELECT * FROM orders WHERE total_amount > 100;

-- When you're done, run: bun run sql

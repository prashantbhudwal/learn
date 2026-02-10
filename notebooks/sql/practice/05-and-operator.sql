-- =====================================================
-- LESSON 5: Combining Conditions with AND
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- The inventory manager needs to find products that are
-- running low on stock AND are expensive. Find products where
-- stock is less than 100 AND price is greater than 50.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Real-world queries often need multiple conditions. The AND
-- keyword lets you combine conditions - both must be true for
-- a row to be included. You can chain many conditions with AND.
-- 
-- Each condition uses the same format you learned: column operator
-- value. With AND between them, SQL only returns rows where ALL
-- conditions are satisfied. There's also OR for "either condition"
-- but we'll focus on AND first.
--
-- Pattern: WHERE condition1 AND condition2

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is inventory prioritization logic. The inventory manager wants
-- to focus on high-value items that are running low - these need
-- attention first because they're expensive to stock out on.
-- 
-- The two conditions (stock < 100 AND price > 50) both need to be
-- true for a product to make this list. The thresholds are reasonable:
-- 100 units isn't dangerously low, but combined with high price, it's
-- worth monitoring. If I had used OR instead, we'd see cheap items
-- with low stock and expensive items with plenty of stock - not useful.

-- =====================================================
-- ANSWER SPACE
-- =====================================================
select * from products where stock < 100 and price > 50



-- When you're done, run: bun run sql

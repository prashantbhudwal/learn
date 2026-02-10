-- =====================================================
-- LESSON 9: DISTINCT - Removing Duplicates
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- You want to see which categories have products in stock,
-- but you don't need to see every single product. Just a
-- unique list of category names that appear in the products table.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- When you query a column, you often get the same value appearing
-- multiple times. Think of a list of cities where customers live -
-- New York might appear 50 times, Los Angeles 30 times, etc. If you
-- just want to know "which cities do we have customers in?" without
-- caring how many times each appears, you need a way to collapse
-- duplicates into a single entry. This gives you a set of unique
-- values, showing you the distinct possibilities in your data.

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is dimension exploration - we're looking at the categorical
-- structure of our product catalog. DISTINCT is perfect here because
-- we want to know which categories exist, not how many products are
-- in each.
-- 
-- The query would show each category_id only once, even if that
-- category has 50 products. This is much more useful for getting
-- an overview than scrolling through thousands of duplicate values.
-- Note that we're querying category_id, not category names - we'd
-- need to join with the categories table to get the actual names,
-- but for now the IDs are sufficient to see the unique values.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

select distinct category_id from products


-- When you're done, run: bun run sql

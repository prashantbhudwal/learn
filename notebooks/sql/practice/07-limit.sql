-- =====================================================
-- LESSON 7: LIMIT - Getting a Subset of Results
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Your manager only has time to review the 3 most expensive products.
-- Show them just those top 3, sorted by price highest to lowest.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Sometimes you don't need every single row that matches your query.
-- Imagine asking for all orders from last year - that could be thousands 
-- of rows. When you're just exploring data or need a quick sample, you 
-- want to say "give me just the first N results." This is useful for 
-- previewing data, creating "top 10" lists, or implementing pagination 
-- (showing 20 items per page). The pattern is: get the data, optionally 
-- sort it, then say how many rows you actually want to see.

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a "top N" query - very common in analytics. The manager wants
-- a focused view of the premium products, not the full catalog. Combining
-- ORDER BY with LIMIT creates exactly this kind of ranked list.
-- 
-- The ORDER BY must come before LIMIT - we need to sort first to ensure
-- we're getting the actual top 3 most expensive, not just 3 random rows.
-- Using DESC is crucial here since we want highest price first. Without
-- it, we'd get the 3 cheapest products, which is the opposite of what
-- the manager asked for.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

select * from products order by price desc limit 3

-- When you're done, run: bun run sql

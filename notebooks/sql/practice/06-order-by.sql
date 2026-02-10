-- =====================================================
-- LESSON 6: ORDER BY - Sorting Results
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Your manager wants to see all products sorted by price.
-- Start with the cheapest items first to identify budget-friendly options.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- When you query data, the order it comes back in is random by default. 
-- Think of it like grabbing papers from a messy pile - you'll get them, 
-- just not in any particular order. Sometimes that doesn't matter, but 
-- often you need to see results organized in a meaningful way. The pattern 
-- is: get the data first, then tell it how to arrange it. You can sort 
-- by any column - numbers, text, dates - and choose whether to go smallest 
-- to largest or the other way around.

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a typical browsing query - the manager is looking for budget
-- options, so ascending price order makes the most sense. Cheapest first
-- lets them quickly scan until they hit their budget ceiling.
-- 
-- The default sort order is ASC (ascending), so technically I don't need
-- to specify it, but I should consider whether explicit is better here.
-- For a simple query like this, the default behavior is well-known, so
-- leaving it implicit is fine. If this were going into production code
-- with multiple sort criteria, I'd be more explicit about direction.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

select * from products order by price


-- When you're done, run: bun run sql

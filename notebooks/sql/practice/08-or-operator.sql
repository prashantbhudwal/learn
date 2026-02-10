-- =====================================================
-- LESSON 8: OR Operator - Either Condition Works
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Find all products that are either in the Electronics category 
-- OR have a price over $500. Your manager wants to see premium items 
-- across all categories plus all Electronics regardless of price.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Sometimes you want to find items that match ANY of several conditions, 
-- not all of them. Think of it as being more flexible with your filters. 
-- If you say "show me apples OR oranges," you want both fruits, not just 
-- items that are somehow both an apple and an orange at the same time. 
-- This is the opposite of being strict - instead of narrowing down, you're 
-- casting a wider net. An item only needs to satisfy one of the conditions 
-- to be included, though it's fine if it satisfies both.

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a portfolio analysis query - the manager is building a premium
-- products view. The logic captures two distinct segments: Electronics
-- (regardless of price) and high-value items (regardless of category).
-- 
-- Using OR here makes sense because these are independent criteria. An
-- Electronics product priced at $50 should still show up (category match).
-- A Furniture product at $600 should also show up (price match). Using
-- AND would be wrong - we'd only see expensive Electronics, missing both
-- cheap Electronics and expensive items in other categories. The category_id
-- for Electronics needs to be determined from the data or schema - it's
-- probably 1 or similar.

-- =====================================================
-- ANSWER SPACE
-- =====================================================



-- When you're done, run: bun run sql

-- =====================================================
-- LESSON 2: Selecting Specific Columns
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Your boss says: "That's too much info. I just need 
-- their names and email addresses for a newsletter."
-- Get ONLY the first_name and email columns from users.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Sometimes you don't want all columns - that's messy. Instead of
-- using * for everything, you can list exactly which columns you
-- want to see, in the order you want them.
-- 
-- Just write the column names separated by commas after SELECT.
-- This is cleaner and faster, especially with big tables that have
-- dozens of columns but you only need two or three.
--
-- Pattern: SELECT column1, column2 FROM table_name

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a typical refinement after an initial exploration. The boss
-- saw all the data and realized they only need specific fields for their
-- newsletter. This is exactly when you'd move from SELECT * to explicit
-- column selection.
-- 
-- Listing only first_name and email is more efficient - the database
-- transfers less data, and the result is cleaner. I should also consider
-- the order: first_name then email reads naturally for a newsletter list.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

SELECT first_name, email FROM users;

-- When you're done, run: bun run sql

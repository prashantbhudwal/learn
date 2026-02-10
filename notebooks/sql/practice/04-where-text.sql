-- =====================================================
-- LESSON 4: Filtering with WHERE (Text)
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- The customer service team needs to find Alice's 
-- account details. You need to find the user whose first_name 
-- is 'Alice'.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- Filtering text works the same as numbers, but with two key
-- differences. First, text values must be in single quotes
-- like 'Alice' or 'Bob'. Second, you usually use = for exact
-- matches rather than > or <.
-- 
-- The equals sign = checks for exact matches. For text, this
-- means the exact spelling, including capitalization in most
-- databases. Text in SQL is called a "string" and always needs
-- quotes around it.

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- This is a classic customer lookup scenario. The exact match on
-- first_name = 'Alice' assumes there's only one Alice, or we're
-- okay finding all of them. In a real system with thousands of
-- users, there might be multiple Alices, but for a support ticket
-- this is probably sufficient.
-- 
-- The capitalization matters here - 'Alice' won't match 'alice' in
-- most databases. I should be aware that if customer service can't
-- find the record, case sensitivity might be the issue. For a
-- production system, I'd consider using ILIKE or lower() for
-- case-insensitive matching, but exact equality is fine for now.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

select * from users where first_name = 'Alice'

-- When you're done, run: bun run sql

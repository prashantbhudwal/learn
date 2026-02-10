-- =====================================================
-- LESSON 1: Basic SELECT
-- =====================================================

-- =====================================================
-- QUESTION
-- =====================================================
-- Your boss needs to see all customer data.
-- You need to get everything from the users table.

-- =====================================================
-- CONCEPTS
-- =====================================================
-- SQL is how we talk to databases. A database stores data in tables,
-- like spreadsheets. To get data out, we use SELECT queries.
-- 
-- Every query starts with SELECT, which means "I want to retrieve..."
-- Then you say WHAT you want - either * for everything, or specific
-- column names. Then you use FROM to say which table to look in.
-- 
-- The basic pattern is: SELECT * FROM table_name

-- =====================================================
-- CHAIN OF THOUGHT
-- =====================================================
-- The boss asked for "all customer data" which in SQL terms means every
-- column from the users table. This is a data exploration query - they're
-- probably getting familiar with the schema or auditing what we have.
-- 
-- SELECT * is appropriate here because we genuinely want everything,
-- not specific fields. In production code I'd be more selective, but
-- for ad-hoc data exploration this is the standard approach.

-- =====================================================
-- ANSWER SPACE
-- =====================================================

SELECT * FROM users;

-- When you're done, run: bun run sql

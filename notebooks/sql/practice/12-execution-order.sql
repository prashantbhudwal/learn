-- =====================================================
-- LESSON 12: SQL Execution Order
-- =====================================================
-- Reference: CURRICULUM.md Lesson 12
-- Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT


-- =====================================================
-- QUERY 1
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 1
-- -----------------------------------------------------
-- Show the top 5 most expensive products that are currently
-- in stock. Display only the product ID and name, sorted by
-- price from highest to lowest.

-- -----------------------------------------------------
-- CONCEPTS 1
-- -----------------------------------------------------
-- SQL executes clauses in a specific order:
-- FROM → WHERE → ORDER BY → LIMIT
-- 
-- This means: grab the table, filter rows, sort the results,
-- then keep only the first N rows.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 1
-- -----------------------------------------------------
-- Understanding execution order matters for performance and logic.
-- The database first identifies the table (FROM), then immediately
-- filters with WHERE before doing any sorting. This is efficient -
-- why sort 1000 rows if you're only going to keep 5 of them?
--
-- The WHERE clause runs before ORDER BY, which is crucial. If I
-- wanted the 5 cheapest in-stock items instead, I'd still filter
-- first, then sort. The order can't be rearranged - that's just
-- how SQL works.
--
-- LIMIT always runs last. This is perfect for pagination scenarios
-- where you want page 1, page 2, etc. But remember: without an
-- ORDER BY, LIMIT gives you arbitrary rows. Always pair them.

-- -----------------------------------------------------
-- ANSWER SPACE 1
-- -----------------------------------------------------

select * from products where stock > 0 order by price desc limit 5



-- =====================================================
-- QUERY 2
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 2
-- -----------------------------------------------------
-- Count how many orders exist for each status (paid, pending, etc.)
-- and show the results sorted by count from highest to lowest.

-- -----------------------------------------------------
-- CONCEPTS 2
-- -----------------------------------------------------
-- GROUP BY comes before ORDER BY in execution order.
-- FROM → GROUP BY → SELECT (with aggregation) → ORDER BY
-- 
-- The database groups rows first, then calculates aggregates
-- for each group, then sorts the grouped results.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 2
-- -----------------------------------------------------
-- This query introduces GROUP BY execution order. The database
-- first scans the orders table, then groups all rows by status
-- before counting them. This grouping happens before any sorting.
--
-- The COUNT(*) runs during the SELECT phase, which is AFTER
-- grouping. So it counts rows within each group, not the total
-- table rows. This is why we can reference the aliased count
-- in ORDER BY - by that point, the aggregation is done.
--
-- One subtle thing: you can't use the alias "cnt" in a WHERE
-- clause because WHERE runs before SELECT. If you wanted to
-- filter groups by count, you'd need HAVING. But here we want
-- all statuses, so no HAVING needed.

-- -----------------------------------------------------
-- ANSWER SPACE 2
-- -----------------------------------------------------
select status, count(*) as cnt  from orders group by status order by cnt 




-- =====================================================
-- QUERY 3
-- =====================================================

-- -----------------------------------------------------
-- QUESTION 3
-- -----------------------------------------------------
-- Find product categories where the average price is over $100.
-- Only include products that belong to a category (ignore uncategorized
-- products). Show the category_id and average_price, sorted by
-- average price from highest to lowest.

-- -----------------------------------------------------
-- CONCEPTS 3
-- -----------------------------------------------------
-- Full execution order with all clauses:
-- FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
-- 
-- WHERE filters individual rows before grouping.
-- HAVING filters groups after aggregation.
-- This query uses WHERE to exclude NULLs, then HAVING to filter
-- by the calculated average.

-- -----------------------------------------------------
-- CHAIN OF THOUGHT 3
-- -----------------------------------------------------
-- This query demonstrates the full execution order. First, FROM
-- identifies the products table. Then WHERE immediately filters
-- out NULL category_ids - this happens row-by-row before any
-- grouping occurs.
--
-- Next comes GROUP BY, which buckets the remaining rows by
-- category_id. HAVING then filters these groups, keeping only
-- those with AVG(price) > 100. This is different from WHERE
-- because it operates on aggregated values after grouping.
--
-- SELECT runs after HAVING, calculating the final values to
-- return. Finally ORDER BY sorts by the calculated average.
-- This order is fixed - you can't make HAVING run before GROUP BY
-- or make ORDER BY run before SELECT. Understanding this sequence
-- is crucial for writing correct complex queries.

-- -----------------------------------------------------
-- ANSWER SPACE 3
-- -----------------------------------------------------

select category_id, avg(price) as average_price 
from products  
where category_id is not NULL
group by category_id
having average_price > 100


-- When you're done, run: bun run sql

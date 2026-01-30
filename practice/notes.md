Great question! Here are the **core patterns** you should commit to memory. These will come up again and again throughout your career:

---

## 🧠 Key Takeaways

### 1. The "Hash Map / Set" Pattern

**When you see**: "find duplicates", "count frequencies", "check if exists", "find pairs"

**Think**: Use a `Set` or `Map` to trade space for time.

```typescript
// Check existence in O(1)
const seen = new Set()
if (seen.has(item)) {
  /* found! */
}
seen.add(item)

// Count occurrences in O(1)
const counts = new Map()
counts.set(key, (counts.get(key) ?? 0) + 1)
```

**Why it matters**: This single pattern solves _hundreds_ of problems. It turns $O(n^2)$ brute force into $O(n)$ linear time.

---

### 2. The Space-Time Tradeoff

| Approach                   | Time          | Space  |
| :------------------------- | :------------ | :----- |
| Brute Force (Nested Loops) | $O(n^2)$      | $O(1)$ |
| Sorting                    | $O(n \log n)$ | $O(1)$ |
| Hash Map / Set             | $O(n)$        | $O(n)$ |

**The rule**: You can almost always make code faster by using more memory. In practice, memory is cheap—prefer speed.

---

### 3. Early Returns Save Work

```typescript
if (s.length !== t.length) return false // ← Don't even start if impossible
```

Always check for quick "impossible" cases first. This is a simple optimization that makes your code faster _and_ more readable.

---

### 4. The "Frequency Map" is Your Friend

Whenever a problem involves **counting** or **comparing counts** of things (characters, numbers, occurrences), a frequency map is almost always the right tool.

---

## 📝 One-Liner for Your Notes

> **"When comparing or finding duplicates, reach for a Set or Map first. It's $O(n)$ time, and that's usually good enough."**

These two problems are foundational. You'll see this exact pattern in: anagrams, two-sum, grouping problems, caching, deduplication, and many more!

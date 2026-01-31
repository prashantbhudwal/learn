# The Hash-Based Lookup Pattern: A Complete Primer

The **Hash-Based Lookup** pattern is one of the most powerful and versatile patterns in programming. It comes in two flavors: **Sets** (for existence checks) and **Maps** (for counting). Once you internalize this pattern, you'll start seeing it everywhere—in interviews, in production code, and in your daily problem-solving.

---

## Table of Contents

1. [The Big Picture: Set vs Map](#the-big-picture-set-vs-map)
2. [The Core Intuition: The "Notebook" Analogy](#the-core-intuition-the-notebook-analogy)
3. [Choosing the Right Tool](#choosing-the-right-tool)
4. [Part 1: The Set Pattern (Existence Checking)](#part-1-the-set-pattern-existence-checking)
5. [Part 2: The Frequency Map Pattern (Counting)](#part-2-the-frequency-map-pattern-counting)
6. [The Building Blocks](#the-building-blocks)
7. [Pattern Variations](#pattern-variations)
8. [Worked Examples](#worked-examples)
9. [Common Pitfalls](#common-pitfalls)
10. [Time and Space Complexity](#time-and-space-complexity)
11. [Practice Problems](#practice-problems)

---

## The Big Picture: Set vs Map

Both `Set` and `Map` are hash-based data structures that give you O(1) lookups. The difference is what question they answer:

| Data Structure | What it Stores         | Question it Answers                |
| -------------- | ---------------------- | ---------------------------------- |
| **Set**        | Just keys (existence)  | "Have I seen this before?"         |
| **Map**        | Keys + Values (counts) | "How many times have I seen this?" |

**A Set is a simplified Map** where you only care about existence (count > 0), not the actual count.

```typescript
// Set: "Does 3 exist?"
const seen = new Set([1, 2, 3])
seen.has(3) // true

// Map: "How many times does 3 appear?"
const counts = new Map([
  ['a', 3],
  ['b', 2],
])
counts.get('a') // 3
```

### The Mental Rule

| If you need to know...      | Use... | Example Problem        |
| --------------------------- | ------ | ---------------------- |
| "Does X exist?"             | `Set`  | Contains Duplicate     |
| "How many of X?"            | `Map`  | Valid Anagram          |
| "What is the first/only X?" | `Map`  | First Unique Character |

---

## The Core Intuition: The "Notebook" Analogy

Imagine you're a librarian and someone asks, "How many copies of each book do we have?"

**The Slow Way (Brute Force):**
Every time someone asks about a specific book, you walk through the entire library, counting that book one by one. This is like using nested loops—it works, but it's painfully slow.

**The Fast Way (Hash-Based Lookup):**
You walk through the library **once**, writing down each book title in your **notebook**.

- If you only need to know "do we have this book?" → just write the title (that's a **Set**)
- If you need to know "how many copies?" → write the title with a tally mark (that's a **Map**)

Now, when someone asks about any book, you just look it up in your notebook instantly.

### The Two Phases

Almost every hash-based lookup problem follows this structure:

```
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 1: BUILD                          │
│                                                             │
│   Walk through the data once, recording in set/map.        │
│   Time: O(n) — you touch each element exactly once.        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 2: QUERY                          │
│                                                             │
│   Use the set/map to answer questions instantly.           │
│   Time: O(1) per lookup.                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Choosing the Right Tool

Here's a decision tree to pick the right data structure:

```
                    ┌─────────────────────────────────────┐
                    │ Do I need to remember things I've   │
                    │ seen for fast lookup later?         │
                    └───────────────┬─────────────────────┘
                                    │
                           ┌────────┴────────┐
                           │                 │
                          YES               NO
                           │                 │
                           ▼                 ▼
              ┌────────────────────┐   Use arrays/loops
              │ Do I need to know  │   (brute force)
              │ HOW MANY times?    │
              └─────────┬──────────┘
                        │
               ┌────────┴────────┐
               │                 │
              YES               NO
               │                 │
               ▼                 ▼
          Use MAP            Use SET
     (frequency map)    (existence check)
```

---

## Part 1: The Set Pattern (Existence Checking)

Use a **Set** when you only need to know: "Have I seen this before?"

### When to Use

- Finding duplicates ("does any element repeat?")
- Checking membership ("is X in the collection?")
- Finding missing elements ("which numbers from 1-n are missing?")
- Intersection/Union operations

### The Core Pattern

```typescript
const seen = new Set<T>()

for (const item of items) {
  if (seen.has(item)) {
    // We've seen this before!
  }
  seen.add(item)
}
```

### Example: Contains Duplicate

```typescript
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>()

  for (const num of nums) {
    if (seen.has(num)) return true // Duplicate found!
    seen.add(num)
  }

  return false
}
```

### Set One-Liner Trick

```typescript
// If Set size differs from array length, there are duplicates
const hasDuplicates = new Set(nums).size !== nums.length
```

### Set Operations

```typescript
const set = new Set<number>();

set.add(5);           // Add element
set.has(5);           // Check existence → true
set.delete(5);        // Remove element
set.size;             // Get count of elements

// Convert to array
const arr = [...set];

// Iterate
for (const item of set) { ... }
```

---

## Part 2: The Frequency Map Pattern (Counting)

Use a **Map** when you need to know: "How many times does X appear?"

### When to Use

- Counting occurrences
- Comparing character/element counts (anagrams)
- Finding elements with specific counts (unique, most frequent)
- Grouping by some property
- Subset/superset checks ("can word be formed from chars?")

### The Core Pattern

```typescript
const counts = new Map<T, number>()

for (const item of items) {
  counts.set(item, (counts.get(item) ?? 0) + 1)
}
```

### Example: Valid Anagram

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false

  const counts = new Map<string, number>()

  // Increment for s
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }

  // Decrement for t
  for (const ch of t) {
    const current = counts.get(ch)
    if (!current) return false
    counts.set(ch, current - 1)
  }

  return true
}
```

---

## The Building Blocks

### 1. Creating a Frequency Map

**Using a `Map` (Recommended):**

```typescript
function buildFrequencyMap(items: string[]): Map<string, number> {
  const frequencyMap = new Map<string, number>()

  for (const item of items) {
    frequencyMap.set(item, (frequencyMap.get(item) ?? 0) + 1)
  }

  return frequencyMap
}

// Usage:
const counts = buildFrequencyMap(['a', 'b', 'a', 'c', 'a', 'b'])
// Map { 'a' => 3, 'b' => 2, 'c' => 1 }
```

**Using a Plain Object (Good for simple string keys):**

```typescript
function buildFrequencyObject(items: string[]): Record<string, number> {
  const frequencyMap: Record<string, number> = {}

  for (const item of items) {
    frequencyMap[item] = (frequencyMap[item] ?? 0) + 1
  }

  return frequencyMap
}

// Usage:
const counts = buildFrequencyObject(['a', 'b', 'a', 'c', 'a', 'b'])
// { a: 3, b: 2, c: 1 }
```

### Map vs Object: When to Use Which?

| Feature         | `Map`                                     | Plain Object `{}`                            |
| --------------- | ----------------------------------------- | -------------------------------------------- |
| Key types       | Any type (numbers, objects, etc.)         | Strings and Symbols only                     |
| Iteration order | Guaranteed insertion order                | Mostly guaranteed (ES2015+)                  |
| Size            | `.size` property                          | `Object.keys(obj).length`                    |
| Performance     | Slightly faster for frequent adds/deletes | Slightly faster for static data              |
| Syntax          | `.get()`, `.set()`, `.has()`              | `obj[key]`, `obj[key] = value`, `key in obj` |

**Rule of thumb:** Use `Map` by default. Use objects when you need JSON serialization.

### 2. The Idiomatic One-Liner

You'll write this line so often it should become muscle memory:

```typescript
map.set(key, (map.get(key) ?? 0) + 1)
```

Breaking it down:

- `map.get(key)` — Get the current count for this key
- `?? 0` — If the key doesn't exist, treat the count as 0
- `+ 1` — Increment the count
- `map.set(key, ...)` — Store the new count

### 3. Querying the Map

```typescript
// Check if a key exists
if (frequencyMap.has('apple')) { ... }

// Get the count (with a default)
const count = frequencyMap.get('apple') ?? 0;

// Iterate through all entries
for (const [key, count] of frequencyMap) {
  console.log(`${key}: ${count}`);
}

// Get all keys
const keys = [...frequencyMap.keys()];

// Get all values (counts)
const values = [...frequencyMap.values()];
```

---

## Pattern Variations

### Variation 1: Simple Counting

The most basic use case. Just count and query.

```typescript
// Problem: Find the most frequent element
function mostFrequent(nums: number[]): number {
  const counts = new Map<number, number>()

  // Build
  for (const num of nums) {
    counts.set(num, (counts.get(num) ?? 0) + 1)
  }

  // Query
  let maxCount = 0
  let result = nums[0]

  for (const [num, count] of counts) {
    if (count > maxCount) {
      maxCount = count
      result = num
    }
  }

  return result
}
```

### Variation 2: Comparison (Two Maps)

Build frequency maps for two inputs and compare them.

```typescript
// Problem: Check if two strings are anagrams
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false

  const countS = new Map<string, number>()
  const countT = new Map<string, number>()

  for (const ch of s) countS.set(ch, (countS.get(ch) ?? 0) + 1)
  for (const ch of t) countT.set(ch, (countT.get(ch) ?? 0) + 1)

  // Compare the maps
  if (countS.size !== countT.size) return false

  for (const [char, count] of countS) {
    if (countT.get(char) !== count) return false
  }

  return true
}
```

### Variation 3: Increment/Decrement (Single Map)

Build a map with one input, then decrement with the other. This is more space-efficient.

```typescript
// Problem: Check if two strings are anagrams (optimized)
function isAnagramOptimized(s: string, t: string): boolean {
  if (s.length !== t.length) return false

  const counts = new Map<string, number>()

  // Increment for s
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }

  // Decrement for t
  for (const ch of t) {
    const current = counts.get(ch)
    if (!current) return false // Character not found or count exceeded
    counts.set(ch, current - 1)
  }

  return true
}
```

### Variation 4: Subset Check (Can Be Formed)

Check if one collection's counts are a subset of another's.

```typescript
// Problem: Can 'word' be formed using characters in 'chars'?
function canFormWord(word: string, chars: string): boolean {
  // Build frequency map for available characters
  const available = new Map<string, number>()
  for (const ch of chars) {
    available.set(ch, (available.get(ch) ?? 0) + 1)
  }

  // Check if word can be formed
  for (const ch of word) {
    const count = available.get(ch)
    if (!count) return false // Not available or used up
    available.set(ch, count - 1)
  }

  return true
}

// Note: This modifies 'available'. For multiple words,
// you'd need to clone or rebuild the map.
```

### Variation 5: Finding Unique/Duplicates

Use the map to identify elements with specific counts.

```typescript
// Problem: Find first unique character
function firstUniqChar(s: string): number {
  const counts = new Map<string, number>()

  // Build frequency map
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }

  // Find first character with count of 1
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) {
      return i
    }
  }

  return -1
}
```

### Variation 6: Grouping

Use a map where values are arrays (grouping elements by some key).

```typescript
// Problem: Group anagrams together
function groupAnagrams(words: string[]): string[][] {
  const groups = new Map<string, string[]>()

  for (const word of words) {
    // Create a "signature" for the word (sorted characters)
    const signature = word.split('').sort().join('')

    // Group words with the same signature
    if (!groups.has(signature)) {
      groups.set(signature, [])
    }
    groups.get(signature)!.push(word)
  }

  return [...groups.values()]
}

// Usage:
groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
// [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

### Variation 7: Sliding Window with Frequency Map

Maintain a frequency map as you slide through an array.

```typescript
// Problem: Find all anagrams of 'p' in string 's'
function findAnagrams(s: string, p: string): number[] {
  const result: number[] = []
  const pCount = new Map<string, number>()
  const windowCount = new Map<string, number>()

  // Build frequency map for p
  for (const ch of p) {
    pCount.set(ch, (pCount.get(ch) ?? 0) + 1)
  }

  // Slide a window of size p.length across s
  for (let i = 0; i < s.length; i++) {
    // Add current character to window
    const ch = s[i]
    windowCount.set(ch, (windowCount.get(ch) ?? 0) + 1)

    // Remove character that's no longer in window
    if (i >= p.length) {
      const leftChar = s[i - p.length]
      const leftCount = windowCount.get(leftChar)!
      if (leftCount === 1) {
        windowCount.delete(leftChar)
      } else {
        windowCount.set(leftChar, leftCount - 1)
      }
    }

    // Check if current window matches p's frequency
    if (i >= p.length - 1 && mapsEqual(windowCount, pCount)) {
      result.push(i - p.length + 1)
    }
  }

  return result
}

function mapsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false
  for (const [key, val] of a) {
    if (b.get(key) !== val) return false
  }
  return true
}
```

---

## Worked Examples

### Example 1: Contains Duplicate (Set)

**Problem:** Given an integer array nums, return true if any value appears more than once.

**Thinking Process:**

1. I need to check if any number repeats.
2. Do I need to know _how many times_? **No**, just whether it exists already.
3. → Use a **Set**.

```typescript
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>()

  for (const num of nums) {
    if (seen.has(num)) return true
    seen.add(num)
  }

  return false
}
```

### Example 2: Valid Anagram (Map)

**Problem:** Check if two strings are anagrams.

**Thinking Process:**

1. Anagrams have the same characters in the same quantities.
2. Do I need to know _how many times_ each character appears? **Yes**.
3. → Use a **Map**.

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false

  const counts = new Map<string, number>()

  // Increment for s
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }

  // Decrement for t
  for (const ch of t) {
    const current = counts.get(ch)
    if (!current) return false
    counts.set(ch, current - 1)
  }

  return true
}
```

### Example 3: First Unique Character (Map)

**Problem:** Find the index of the first character that appears exactly once.

**Thinking Process:**

1. I need to know which character has count = 1.
2. Do I need to know counts? **Yes**.
3. → Use a **Map**.

```typescript
function firstUniqChar(s: string): number {
  const counts = new Map<string, number>()

  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i
  }

  return -1
}
```

### Example 4: Words That Can Be Formed by Characters (Map)

**Problem:** Return the sum of lengths of all words that can be formed by characters in `chars`.

**Thinking Process:**

1. Need to check if each word's character counts fit within available characters.
2. Do I need to know counts? **Yes** (need to compare counts).
3. → Use a **Map**.

```typescript
function countCharacters(words: string[], chars: string): number {
  // Build frequency map for available characters
  const available = new Map<string, number>()
  for (const ch of chars) {
    available.set(ch, (available.get(ch) ?? 0) + 1)
  }

  let totalLength = 0

  for (const word of words) {
    if (canForm(word, available)) {
      totalLength += word.length
    }
  }

  return totalLength
}

function canForm(word: string, available: Map<string, number>): boolean {
  // Build frequency map for the word
  const needed = new Map<string, number>()
  for (const ch of word) {
    needed.set(ch, (needed.get(ch) ?? 0) + 1)
  }

  // Check if we have enough of each character
  for (const [ch, count] of needed) {
    if ((available.get(ch) ?? 0) < count) return false
  }

  return true
}
```

### Example 5: Two Sum (Map for Index Lookup)

**Problem:** Find two numbers in an array that add up to a target.

**Thinking Process:**

1. For each number, I need to find if (target - number) exists.
2. I also need the **index** of where it was seen.
3. → Use a **Map** where key = number, value = index.

```typescript
function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>() // number -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (seen.has(complement)) {
      return [seen.get(complement)!, i]
    }

    seen.set(nums[i], i)
  }

  return null
}
```

### Example 6: Top K Frequent Elements (Map)

**Problem:** Return the K most frequent elements.

**Thinking Process:**

1. Need to know frequency of each element, then sort by frequency.
2. → Use a **Map**.

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  // Build frequency map
  const counts = new Map<number, number>()
  for (const num of nums) {
    counts.set(num, (counts.get(num) ?? 0) + 1)
  }

  // Sort entries by count (descending) and take top k
  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num, _]) => num)

  return sorted
}
```

---

## Common Pitfalls

### Pitfall 1: Forgetting the Default Value

```typescript
// ❌ WRONG: This crashes if key doesn't exist
map.set(key, map.get(key) + 1) // undefined + 1 = NaN

// ✅ CORRECT: Use nullish coalescing
map.set(key, (map.get(key) ?? 0) + 1)
```

### Pitfall 2: Using `||` Instead of `??`

```typescript
// ❌ PROBLEMATIC: 0 is falsy, so this treats 0 as "not found"
const count = map.get(key) || 0

// ✅ BETTER: Only treats null/undefined as "not found"
const count = map.get(key) ?? 0
```

In frequency maps this usually doesn't matter (counts are positive), but it's a good habit.

### Pitfall 3: Modifying the Map While Checking Multiple Words

```typescript
// ❌ WRONG: This mutates the original map
function canFormAll(words: string[], chars: string): boolean {
  const available = buildMap(chars)

  for (const word of words) {
    for (const ch of word) {
      // This permanently decrements available counts!
      available.set(ch, available.get(ch)! - 1)
    }
  }
}

// ✅ CORRECT: Create a fresh check for each word
function canFormAll(words: string[], chars: string): boolean {
  const available = buildMap(chars)

  for (const word of words) {
    // Use a separate function that doesn't modify 'available'
    if (!canForm(word, available)) return false
  }
  return true
}
```

### Pitfall 4: Comparing Maps Incorrectly

```typescript
// ❌ WRONG: Maps are objects, reference comparison doesn't work
if (mapA === mapB) { ... } // Always false for different map instances

// ✅ CORRECT: Compare manually
function mapsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, val] of a) {
    if (b.get(key) !== val) return false;
  }
  return true;
}
```

### Pitfall 5: Using Set When You Need Counts

```typescript
// ❌ WRONG: This only tells you if 'a' exists, not how many times
const set = new Set(['a', 'b', 'a', 'a'])
// You can't tell that 'a' appeared 3 times!

// ✅ CORRECT: Use a Map if you need counts
const map = new Map()
for (const ch of ['a', 'b', 'a', 'a']) {
  map.set(ch, (map.get(ch) ?? 0) + 1)
}
// Map { 'a' => 3, 'b' => 1 }
```

---

## Time and Space Complexity

| Operation                              | Time Complexity | Notes                     |
| -------------------------------------- | --------------- | ------------------------- |
| `set.has(key)` / `map.has(key)`        | O(1) average    | Hash lookup               |
| `set.add(key)` / `map.set(key, value)` | O(1) average    | Hash insertion            |
| `set.delete(key)` / `map.delete(key)`  | O(1) average    | Hash deletion             |
| Building from n items                  | O(n)            | One pass through data     |
| Iterating through set/map              | O(k)            | k = number of unique keys |

### Typical Problem Complexity

| Pattern               | Time     | Space                          |
| --------------------- | -------- | ------------------------------ |
| Set (existence check) | O(n)     | O(k) where k = unique elements |
| Map (frequency count) | O(n)     | O(k) where k = unique elements |
| Two Maps Comparison   | O(n + m) | O(k₁ + k₂)                     |
| Increment/Decrement   | O(n + m) | O(k)                           |

**Key Insight:** For problems constrained to "lowercase English letters" (26 characters), space complexity is effectively O(1) since the map never grows beyond 26 entries.

---

## Practice Problems

Here are problems organized by difficulty:

### Easy

1. **Contains Duplicate** - Use Set ✓
2. **Valid Anagram** - Use Map ✓
3. **First Unique Character** - Use Map ✓
4. **Find All Numbers Disappeared in an Array** - Use Set
5. **Intersection of Two Arrays** - Use Set

### Medium

1. **Top K Frequent Elements** - Use Map ✓
2. **Group Anagrams** - Use Map ✓
3. **Find All Anagrams in a String** - Use Map (sliding window)
4. **Longest Substring Without Repeating Characters** - Use Set (sliding window)
5. **Subarray Sum Equals K** - Use Map (prefix sum)

### Hard

1. **Minimum Window Substring** - Use Map
2. **Longest Duplicate Substring** - Use Map + rolling hash
3. **Count of Range Sum** - Use Map

---

## Summary: The Decision Checklist

When you encounter a problem, ask yourself:

1. **Do I need fast lookup?** → Consider hash-based structure
2. **Do I only need to know if something exists?** → Use a **Set**
3. **Do I need to know how many times?** → Use a **Map** (frequency map)
4. **Do I need to compare counts between two collections?** → Build two maps and compare
5. **Can I save space by incrementing and decrementing?** → Use the single-map approach
6. **Do I need to group items by some property?** → Use a map where values are arrays

---

## Quick Reference: The Code Snippets You'll Use Forever

```typescript
// ═══════════════════════════════════════════
// SET: "Does it exist?"
// ═══════════════════════════════════════════

const seen = new Set<T>()
if (seen.has(item)) {
  /* found! */
}
seen.add(item)

// One-liner duplicate check
const hasDuplicates = new Set(items).size !== items.length

// ═══════════════════════════════════════════
// MAP: "How many times?"
// ═══════════════════════════════════════════

// Build a frequency map
const counts = new Map<T, number>()
for (const item of items) {
  counts.set(item, (counts.get(item) ?? 0) + 1)
}

// Get count with default
const count = counts.get(item) ?? 0

// Compare two maps
function mapsEqual<K, V>(a: Map<K, V>, b: Map<K, V>): boolean {
  if (a.size !== b.size) return false
  for (const [k, v] of a) {
    if (b.get(k) !== v) return false
  }
  return true
}

// Decrement (for subset checking)
const current = counts.get(item)
if (!current) return false // Not available
counts.set(item, current - 1)
```

---

## The Golden Rule

> **Ask yourself: "Do I need to know _if_ it exists, or _how many_ times?"**
>
> - **If** → Set
> - **How many** → Map

Both are O(n) time, O(k) space. Both are your best friends.

Happy coding! 🚀

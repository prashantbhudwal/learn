/**
 * First Unique Character in a String.

Given a string s, find the first non-repeating character in it and return its index. If it doesn't exist, return -1.

Example 1: Input: s = "leetcode" Output: 0 (The letter 'l' is the first character and it never appears again).

Example 2: Input: s = "loveleetcode" Output: 2 ('l' repeats, 'o' repeats, but 'v' is the first one that appears exactly once).

 */

const findUnique = function (s: string) {
  const notebook = new Map()

  for (const ch of s) {
    if (notebook.has(ch)) {
      notebook.set(ch, notebook.get(ch) + 1)
    } else {
      notebook.set(ch, 1)
    }
  }

  console.log(notebook)

  for (const ch of s) {
    if (notebook.get(ch) === 1) {
      return ch
    }
  }
}

console.log(findUnique('leetcode'))

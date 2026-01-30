/**
 * 
 You are given an array of strings strs. Return the longest common prefix of all the strings.

If there is no longest common prefix, return an empty string "".

Example 1:

Input: strs = ["bat","bag","bank","band"]

Output: "ba"
Example 2:

Input: strs = ["dance","dag","danger","damage"]

Output: "da"
Example 3:

Input: strs = ["neet","feet"]

Output: ""
Constraints:

1 <= strs.length <= 200
0 <= strs[i].length <= 200
strs[i] is made up of lowercase English letters if it is non-empty.

 */

function longestCommonPrefix(strs: Array<string>) {
  if (strs.length === 0) return ''
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }
  return prefix
}

/**
 * Practice problem: Intersection of K Interval Lists (Horizontal Scanning)
Problem statement

You’re given k lists of closed intervals.
Each list is sorted by start time and non-overlapping within itself.

Return the list of intervals where all k lists overlap (i.e., the intersection of all lists).

Input

intervals: a list of k interval-lists
intervals[i] = [[s1,e1],[s2,e2],...]

Output

a list of closed intervals representing the overlap common to everyone

Example

intervals = [
  [[1, 5], [10, 14], [16, 18]],
  [[2, 6], [8, 10], [11, 20]],
  [[0, 2], [9, 12], [13, 17]]
]

Output: [[2,2], [11,12], [13,14], [16,17]]
 */








export default function main() {
  console.log(longestCommonPrefix(['dance', 'dag', 'danger', 'damage']))
  console.log(longestCommonPrefix(['neet', 'feet']))
  console.log(longestCommonPrefix(['dance', 'dance']))
}

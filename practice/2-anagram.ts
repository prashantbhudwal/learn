/**
 * Valid Anagram
Given two strings s and t, return true if the two strings are anagrams of each other, otherwise return false.

An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.

Example 1:

Input: s = "racecar", t = "carrace"

Output: true
Example 2:

Input: s = "jar", t = "jam"

Output: false
Constraints:

s and t consist of lowercase English letters.
 */
function mapsEqual(a: any, b: any) {
  if (a.size !== b.size) return false
  for (const [k, v] of a) {
    if (!b.has(k)) return false
    if (b.get(k) !== v) return false
  }
  return true
}
const isValidAnagram = function (s: string, t: string) {
  if (s.length !== t.length) return false
  const frequencyS = new Map()
  for (const ch of s) {
    frequencyS.set(ch, (frequencyS.get(ch) ?? 0) + 1)
  }
  console.log(frequencyS)
  const frequencyT = new Map()

  for (const ch of t) {
    frequencyT.set(ch, (frequencyT.get(ch) ?? 0) + 1)
  }
  if (frequencyS.size !== frequencyT.size) return false
  for (const [k, v] of frequencyS) {
    if (!frequencyT.has(k)) return false
    if (frequencyT.get(k) !== v) return false
  }
  return true
}

isValidAnagram('racecar', 'carrace')

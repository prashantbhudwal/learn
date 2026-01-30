/**
 * "Find Words That Can Be Formed by Characters."

The Problem
You are given a list of words and a string of chars. A word is "good" if it can be formed by the characters in chars (you can only use each character from chars as many times as it appears).

Return the sum of lengths of all good words.

Example:

Input: words = ["cat", "bt", "hat", "tree"], chars = "atach"

Process:

"cat": Needs 'c', 'a', 't'. chars has 'a', 't', 'a', 'c', 'h'. (OK!)

"bt": Needs 'b'. chars has no 'b'. (Fail)

"hat": Needs 'h', 'a', 't'. chars has them. (OK!)

"tree": Needs 't', 'r', 'e', 'e'. chars has no 'r' or 'e'. (Fail)

Output: 6 (Length of "cat" + length of "hat").

Your Turn
Using the "Notebook" (Frequency Map) intuition:

Which data do you need to turn into a "notebook" first?

How would you check each word against that notebook?
 */
const getFrequencyMap = function (s: string) {
  const charMap = new Map()

  for (const char of s) {
    if (charMap.has(char)) {
      charMap.set(char, charMap.get(char) + 1)
    } else {
      charMap.set(char, 1)
    }
  }
  return charMap
}

function findWords(words: Array<string>, chars: string) {
  /**
   * 1. turn the chars into a frequency map
   * 2. check each word against the map
   *  - frequency map of word should be less than equal to to frequency map of chars
   *  - if yes save the word into an array
   *  - if no, move on
   * 3. sum the lengths of the chars in the array
   */
  const foundWords: Array<string> = []
  const charMap = getFrequencyMap(chars)
  for (const word of words) {
    const wordMap = getFrequencyMap(word)
    console.log(wordMap)
    let isGood = true
    for (const [k, v] of wordMap) {
      if (charMap.get(k) && charMap.get(k) >= v) {
        continue
      } else {
        isGood = false
      }
    }

    isGood && foundWords.push(word)
  }
  return foundWords.reduce((acc, item) => acc + item.length, 0)
}

export default function run() {
  console.log(findWords(['cat', 'bt', 'hat', 'tree'], 'atach'))
}

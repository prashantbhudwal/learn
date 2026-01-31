/**
 * Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.

Example 1:

Input: nums = [1, 2, 3, 3]

Output: true

Example 2:

Input: nums = [1, 2, 3, 4]

Output: false
 */

const hasDuplicates = function (nums: Array<number>) {
  for (let i = 0; i < nums.length; i++) {
    // console.log(nums[i])
    for (let j = i + 1; j < nums.length; j++) {
      console.log(nums[j])
      if (nums[i] === nums[j]) {
        console.log(nums[i], nums[j])
        return true
      }
    }
    console.log('___')
  }
  return false
}

hasDuplicates([1, 2, 3, 3])

const hasDuplicatesFast = function (nums: Array<number>) {
  const hasDuplicates = new Set(nums).size !== nums.length
  return hasDuplicates
}

const hasDuplicatesWithSets = function (nums: Array<number>) {
  const seen = new Set<number>()
  for (const num of nums) {
    if (seen.has(num)) {
      return true
    }
    seen.add(num)
  }
  return false
}

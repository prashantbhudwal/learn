import { describe, expect, test } from 'vitest'
import { add, divide, subtract } from './math'
import { createUser } from './user'
describe('math functions', () => {
  test('vitest is running', () => {
    expect(true).toBe(true)
  })

  test('should return the sum', () => {
    expect(add(1, 2)).toBe(3)
  })
  test('should return the differnce', () => {
    expect(subtract(2, 1)).toBe(1)
  })
  test('divide by zero should throw error', () => {
    expect(() => divide(1, 0)).toThrow('Cannot divide by zero')
  })
})

describe('user functions', () => {
  test('should create user', () => {
    expect(createUser('John', 30)).toStrictEqual({
      name: 'John',
      age: 30,
      id: 1,
    })
  })
})

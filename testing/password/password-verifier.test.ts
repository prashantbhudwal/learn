// password-verifier.test.ts
import { describe, test, expect } from 'vitest'
import { verifyPassword, Rule } from '.'

describe('verifyPassword', () => {
  test('given a failing rule, returns errors', () => {
    // ARRANGE
    const fakeRule: Rule = (input) => ({
      passed: false,
      reason: 'fake reason',
    })

    // ACT
    const errors = verifyPassword('any value', [fakeRule])

    // ASSERT
    expect(errors[0]).toContain('fake reason')
  })
})

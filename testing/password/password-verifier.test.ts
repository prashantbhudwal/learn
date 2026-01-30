// password-verifier.test.ts
import { describe, test, expect, it } from 'vitest'
import { verifyPassword, Rule } from './password-verifier'

const makeFakeRule = (
  passed: boolean,
  reason: string = 'fake reason',
): Rule => {
  return (input: string) => ({ passed, reason })
}

describe('verifyPassword', () => {
  test.each([
    ['too short', 'error too short'],
    ['no uppercase', 'error no uppercase'],
    ['complexity', 'error complexity'],
  ])(
    'given a failing rule with reason "%s", returns error "%s"',
    (reason, expectedError) => {
      // ARRANGE
      const fakeRule = makeFakeRule(false, reason)

      // ACT
      const errors = verifyPassword('any value', [fakeRule])

      // ASSERT
      expect(errors[0]).toContain(expectedError)
    },
  )
})

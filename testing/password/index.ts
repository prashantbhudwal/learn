// password-verifier.ts

// 1. Define the shape of the output for a rule
export interface RuleResult {
  passed: boolean
  reason: string
}

// 2. Define the shape of a Rule function
// It takes a string input and returns a RuleResult
export type Rule = (input: string) => RuleResult

export const verifyPassword = (input: string, rules: Rule[]): string[] => {
  const errors: string[] = []

  rules.forEach((rule) => {
    const result = rule(input)

    if (!result.passed) {
      errors.push(`error ${result.reason}`)
    }
  })

  return errors
}

/* eslint-disable no-undef */
const sum = (a, b) => {
  return a + b
}

describe('Sum of two items', () => {
  test('It should return 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})

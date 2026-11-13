import { parseCognitoGroups } from './cognitoGroups'

describe('parseCognitoGroups', () => {
  describe('shapes of input', () => {
    it('returns an array of strings as it is', () => {
      expect(parseCognitoGroups(['group-a', 'group-b'])).toEqual([
        'group-a',
        'group-b',
      ])
    })

    it.each([
      ['comma-separated', 'group-a,group-b'],
      ['semicolon-separated', 'group-a;group-b'],
      ['bracketed', '[group-a, group-b]'],
    ])('splits a %s string', (_, value) => {
      expect(parseCognitoGroups(value)).toEqual(['group-a', 'group-b'])
    })

    it('splits a string with both kinds of separator', () => {
      expect(parseCognitoGroups('group-a,group-b;group-c')).toEqual([
        'group-a',
        'group-b',
        'group-c',
      ])
    })

    it('returns a single group name as a one-item array', () => {
      expect(parseCognitoGroups('group-a')).toEqual(['group-a'])
    })

    it('splits array items that contain separators', () => {
      expect(parseCognitoGroups(['group-a,group-b', 'group-c'])).toEqual([
        'group-a',
        'group-b',
        'group-c',
      ])
    })
  })

  describe('cleaning', () => {
    it('trims whitespace around each group', () => {
      expect(parseCognitoGroups(['  group-a ', 'group-b\t'])).toEqual([
        'group-a',
        'group-b',
      ])
    })

    it('drops empty entries', () => {
      expect(parseCognitoGroups('group-a,, ,group-b,')).toEqual([
        'group-a',
        'group-b',
      ])
    })
  })

  describe('bad input', () => {
    it.each([
      ['undefined', undefined],
      ['null', null],
      ['an empty string', ''],
      ['a number', 42],
      ['an object', { groups: 'group-a' }],
    ])('returns an empty array for %s', (_, value) => {
      expect(parseCognitoGroups(value)).toEqual([])
    })

    it('ignores array members that are not strings', () => {
      expect(parseCognitoGroups(['group-a', 1, null, {}])).toEqual(['group-a'])
    })
  })
})

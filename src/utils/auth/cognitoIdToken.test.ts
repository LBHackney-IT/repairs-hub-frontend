/** @jest-environment node */
import { makeIdToken } from 'factories/session_cookie'
import { readCognitoIdTokenClaims } from './cognitoIdToken'

const encode = (value: string) => Buffer.from(value).toString('base64url')

describe('readCognitoIdTokenClaims', () => {
  describe('valid tokens', () => {
    it('returns the claims in the payload', () => {
      const token = makeIdToken({
        sub: 'user-sub',
        exp: 1900000000,
        email: 'ada@example.com',
        name: 'Ada Lovelace',
        'custom:groups': ['group-a', 'group-b'],
      })

      expect(readCognitoIdTokenClaims(token)).toEqual({
        sub: 'user-sub',
        exp: 1900000000,
        email: 'ada@example.com',
        name: 'Ada Lovelace',
        'custom:groups': ['group-a', 'group-b'],
      })
    })

    it('decodes a unicode name correctly', () => {
      const token = makeIdToken({ name: 'José Müller 田中' })

      expect(readCognitoIdTokenClaims(token)?.name).toBe('José Müller 田中')
    })

    it('does not check the signature', () => {
      // openid-client verifies the token at sign-in, so this only reads it
      const [header, payload] = makeIdToken({ sub: 'user-sub' }).split('.')

      expect(
        readCognitoIdTokenClaims(`${header}.${payload}.not-a-real-signature`)
      ).toMatchObject({ sub: 'user-sub' })
    })
  })

  describe('malformed tokens', () => {
    it.each([
      ['has no payload segment', 'abc'],
      ['is empty', ''],
      ['has an empty payload segment', 'header..signature'],
      ['has a payload that is not base64url', 'header.!!!.signature'],
      ['has a payload that is not JSON', `header.${encode('not json')}.sig`],
    ])('returns null when the token %s', (_, token) => {
      expect(readCognitoIdTokenClaims(token)).toBeNull()
    })
  })
})

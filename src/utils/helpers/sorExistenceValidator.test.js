import { createSorExistenceValidator } from './sorExistenceValidator'
import axios from 'axios'
import { paramsSerializer } from '@/utils/urls'

jest.mock('axios', () => jest.fn())

describe('createSorExistenceValidator', () => {
  describe('when some codes supplied to the returned function are not present in the API response', () => {
    it('returns an object describing valid and invalid SORs', async () => {
      axios.mockResolvedValueOnce({
        data: [
          {
            code: '12345678',
          },
          {
            code: 'ABCDEFGH',
          },
        ],
      })

      const validator = createSorExistenceValidator(
        'tradeCode',
        'propertyRef',
        'contractorRef',
        true
      )

      const validationResults = await validator([
        '12345678',
        'ABCDEFGH',
        'ABCD1234',
      ])

      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        url: '/api/schedule-of-rates/check',
        paramsSerializer,
        params: {
          tradeCode: 'tradeCode',
          propertyReference: 'propertyRef',
          contractorReference: 'contractorRef',
          sorCode: ['12345678', 'ABCDEFGH', 'ABCD1234'],
          isRaisable: true,
        },
      })

      expect(validationResults).toEqual({
        allCodesValid: false,
        validCodes: [
          {
            code: '12345678',
          },
          {
            code: 'ABCDEFGH',
          },
        ],
        invalidCodes: ['ABCD1234'],
      })
    })
  })

  describe('when all codes supplied to the returned function are present in the API response', () => {
    it('returns an object describing valid and invalid SORs', async () => {
      axios.mockResolvedValueOnce({
        data: [
          {
            code: '12345678',
          },
          {
            code: 'ABCDEFGH',
          },
          {
            code: 'ABCD1234',
          },
        ],
      })

      const validator = createSorExistenceValidator(
        'tradeCode',
        'propertyRef',
        'contractorRef',
        true
      )

      const validationResults = await validator([
        '12345678',
        'ABCD1234',
        'ABCDEFGH',
      ])

      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        url: '/api/schedule-of-rates/check',
        paramsSerializer,
        params: {
          tradeCode: 'tradeCode',
          propertyReference: 'propertyRef',
          contractorReference: 'contractorRef',
          sorCode: ['12345678', 'ABCD1234', 'ABCDEFGH'],
          isRaisable: true,
        },
      })

      expect(validationResults).toEqual({
        allCodesValid: true,
        validCodes: [
          {
            code: '12345678',
          },
          {
            code: 'ABCDEFGH',
          },
          {
            code: 'ABCD1234',
          },
        ],
        invalidCodes: [],
      })
    })
  })

  describe('when the API response errors after calling the returned function', () => {
    it('throws an error', async () => {
      axios.mockImplementationOnce(() =>
        Promise.reject({
          response: { status: 500, data: 'error message' },
        })
      )

      const validator = createSorExistenceValidator(
        'tradeCode',
        'propertyRef',
        'contractorRef'
      )

      await expect(async () => {
        await validator(['somecode'])
      }).rejects.toThrow()
    })
  })
})

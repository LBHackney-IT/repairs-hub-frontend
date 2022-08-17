import {
  frontEndApiRequest,
  fetchFeatureToggles,
  createSorExistenceValidator,
} from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())
import { paramsSerializer } from '@/utils/urls'

describe('frontEndApiRequest`', () => {
  it('calls axios with the expected parameters and returns data', async () => {
    const responseData = { data: 'test' }

    axios.mockResolvedValueOnce({
      data: responseData,
    })

    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/some_endpoint',
      params: { myParam: 1 },
      requestData: { some: 'data' },
    })

    expect(response).toEqual(responseData)
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/some_endpoint',
      params: { myParam: 1 },
      data: { some: 'data' },
    })
  })

  it('does not send a data parameter if requestData is not supplied', async () => {
    const responseData = { data: 'test' }

    axios.mockResolvedValueOnce({
      data: responseData,
    })

    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/some_endpoint',
      params: { myParam: 1 },
    })

    expect(response).toEqual(responseData)
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/some_endpoint',
      params: { myParam: 1 },
    })
  })
})

describe('fetchFeatureToggles', () => {
  describe('when the configuration API returns keys', () => {
    beforeEach(() => {
      axios.mockResolvedValueOnce({
        data: [
          {
            featureToggles: { isIceCreamEnabled: true, isPizzaEnabled: false },
          },
        ],
      })
    })

    it('returns an object with all toggles from the configuration API', async () => {
      expect(await fetchFeatureToggles()).toEqual({
        isIceCreamEnabled: true,
        isPizzaEnabled: false,
      })
    })
  })

  describe('when the configuration API request errors', () => {
    beforeEach(() => {
      axios.mockImplementationOnce(() =>
        Promise.reject({
          response: { status: 500 },
        })
      )
    })

    it('catches the error, logs it, and returns an empty object', async () => {
      const logSpy = jest.spyOn(global.console, 'error')

      expect(await fetchFeatureToggles()).toEqual({})

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching toggles from configuration API')
      )
    })
  })
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
})

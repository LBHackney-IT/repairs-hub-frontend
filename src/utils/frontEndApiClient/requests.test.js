import { frontEndApiRequest, fetchFeatureToggles } from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())

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
})

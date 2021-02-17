import { getTrades } from './trades'
import mockAxios from '../../__mocks__/axios'

describe('getTrades`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getTrades(1)

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/schedule-of-rates/trades?propRef=1'
    )
  })
})

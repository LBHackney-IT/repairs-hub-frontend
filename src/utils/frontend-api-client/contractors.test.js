import { getContractors } from './contractors'
import mockAxios from '../__mocks__/axios'

describe('getContractors', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getContractors('1', 'PL')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/contractors?propertyReference=1&tradeCode=PL'
    )
  })
})

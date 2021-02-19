import { getSorCodes } from './codes'
import mockAxios from '../../__mocks__/axios'

describe('getSorCodes`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getSorCodes('PL', '00001234', 'H01')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/schedule-of-rates/codes', {
      params: {
        contractorReference: 'H01',
        propertyReference: '00001234',
        tradeCode: 'PL',
      },
    })
  })
})

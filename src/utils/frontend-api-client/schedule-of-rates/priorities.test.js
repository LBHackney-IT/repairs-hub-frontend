import { getPriorities } from './priorities'
import mockAxios from '../../__mocks__/axios'

describe('getPriorities`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getPriorities()

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/schedule-of-rates/priorities'
    )
  })
})

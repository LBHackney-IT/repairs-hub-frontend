import { getVariationTasks } from './variation-tasks'
import mockAxios from 'axios'

jest.mock('axios')
describe('getVariationTasks', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getVariationTasks('10000012')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/workOrders/10000012/variation-tasks'
    )
  })
})

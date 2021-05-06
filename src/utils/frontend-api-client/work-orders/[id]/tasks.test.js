import { getTasksAndSors } from './tasks'
import mockAxios from 'axios'

jest.mock('axios')

describe('getTasksAndSors`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getTasksAndSors(10203040)

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/workOrders/10203040/tasks')
  })
})

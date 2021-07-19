import { frontEndApiRequest } from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())
describe('frontEndApiRequest`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }
    axios.mockResolvedValueOnce({
      data: responseData,
    })
    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/filter/WorkOrder',
      params: { myParam: 1 },
      requestData: { some: 'data' },
    })
    expect(response).toEqual(responseData)
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/filter/WorkOrder',
      params: { myParam: 1 },
      data: { some: 'data' },
    })
  })
})

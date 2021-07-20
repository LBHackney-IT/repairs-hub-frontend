import { frontEndApiRequest } from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())
describe('frontEndApiRequest`', () => {
  it('calls the Next JS API to show filters', async () => {
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

  it('calls the Next JS API to get current user', async () => {
    const responseData = { data: 'test' }
    axios.mockResolvedValueOnce({
      data: responseData,
    })
    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/hub-user',
      params: { myParam: 1 },
      requestData: { some: 'data' },
    })
    expect(response).toEqual(responseData)
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/hub-user',
      params: { myParam: 1 },
      data: { some: 'data' },
    })
  })
})

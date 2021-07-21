import { frontEndApiRequest } from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())

describe('frontEndApiRequest`', () => {
  // get filters request
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

  // get current user request
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

  // get work order request
  it('calls the Next JS API to get work order', async () => {
    const responseData = { data: 'test' }
    axios.mockResolvedValueOnce({
      data: responseData,
    })
    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/workOrders/10000012',
      params: { myParam: 1 },
      requestData: { some: 'data' },
    })
    expect(response).toEqual(responseData)
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/workOrders/10000012',
      params: { myParam: 1 },
      data: { some: 'data' },
    })
  })
})

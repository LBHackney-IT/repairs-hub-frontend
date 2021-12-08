import { frontEndApiRequest } from './requests'
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

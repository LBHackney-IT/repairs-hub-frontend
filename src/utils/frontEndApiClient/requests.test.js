import { frontEndApiRequest } from './requests'
import axios from 'axios'
jest.mock('axios', () => jest.fn())

describe('frontEndApiRequest`', () => {
  it.each([
    'https://evil.com/api/x',
    '//evil.com/api/x',
    '/other/path',
    '/api/../admin',
    '/api/%2e%2e/admin',
    '/api/a%2fb',
    '/api\\x',
  ])('rejects unsafe path %s', async (path) => {
    axios.mockClear()

    await expect(frontEndApiRequest({ method: 'get', path })).rejects.toThrow(
      'Unsafe request path'
    )
    expect(axios).not.toHaveBeenCalled()
  })

  it('allows a path with a query string', async () => {
    axios.mockResolvedValueOnce({ data: {} })

    await frontEndApiRequest({
      method: 'get',
      path: '/api/operatives/1/appointments?date=2026-01-01',
    })
  })

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

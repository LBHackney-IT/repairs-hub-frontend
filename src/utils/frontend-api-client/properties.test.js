import { getProperties, getProperty } from './properties'
import mockAxios from '../__mocks__/axios'

describe('getProperties', () => {
  it('calls the Next JS API', async () => {
    const responseData = [{ data: 'test' }]

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getProperties('query')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/properties/?q=query')
  })
})

describe('getProperty', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getProperty('1')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/properties/1')
  })
})

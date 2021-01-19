import { postRepair, getRepair } from './repairs'
import mockAxios from '../__mocks__/axios'

describe('postRepair', () => {
  it('calls the Next JS API', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'foobar' })
    )
    const formData = await postRepair({ foo: 'bar' })

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/api/repairs', {
      foo: 'bar',
    })
    expect(formData).toEqual('foobar')
  })
})

describe('getRepair', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getRepair('10000012')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/repairs/10000012')
  })
})

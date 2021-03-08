import { postRepair } from './schedule'
import mockAxios from 'axios'

jest.mock('axios')

describe('postRepair', () => {
  it('calls the Next JS API', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'foobar' })
    )
    const formData = await postRepair({ foo: 'bar' })

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/api/repairs/schedule', {
      foo: 'bar',
    })
    expect(formData).toEqual('foobar')
  })
})

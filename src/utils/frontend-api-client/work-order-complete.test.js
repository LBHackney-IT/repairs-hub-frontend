import { postWorkOrderComplete } from './work-order-complete'
import mockAxios from '../__mocks__/axios'

describe('postWorkOrderComplete', () => {
  it('calls the Next JS API', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'foobar' })
    )
    const formData = await postWorkOrderComplete({ foo: 'bar' })

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/api/workOrderComplete', {
      foo: 'bar',
    })
    expect(formData).toEqual('foobar')
  })
})

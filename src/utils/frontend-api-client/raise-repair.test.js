import { postRaiseRepairForm } from './raise-repair'
import mockAxios from '../__mocks__/axios'

describe('postRaiseRepairForm', () => {
  it('calls the Next JS API', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'foobar' })
    )
    const formData = await postRaiseRepairForm({ foo: 'bar' })

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/api/raise-repair', {
      foo: 'bar',
    })
    expect(formData).toEqual('foobar')
  })
})

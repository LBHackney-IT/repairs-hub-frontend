import { postJobStatusUpdate } from './job-status-update'
import mockAxios from 'axios'

jest.mock('axios')

describe('postJobStatusUpdate', () => {
  it('calls the Next JS API', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'foobar' })
    )
    const formData = await postJobStatusUpdate({ foo: 'bar' })

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/api/jobStatusUpdate', {
      foo: 'bar',
    })
    expect(formData).toEqual('foobar')
  })
})

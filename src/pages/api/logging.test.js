import { createMocks } from 'node-mocks-http'
import handler from './logging'

describe('/api/logging', () => {
  it('should accept POST requests with a message string', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        message: 'Test log message',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      message: 'Message logged successfully',
    })
  })
})

import { createMocks } from 'node-mocks-http'
import handler from './logging'
import { StatusCodes } from 'http-status-codes'

describe('/api/logging', () => {
  it('should accept POST requests with a message string', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        message: 'Test log message',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(StatusCodes.NO_CONTENT)
  })
})

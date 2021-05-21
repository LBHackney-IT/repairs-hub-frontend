import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '../../../utils/urls'
import MockDate from 'mockdate'

import scheduleEndpoint from './schedule.js'

jest.mock('axios')

const mockBankHolidays = jest.fn()

jest.mock('../../../utils/helpers/bank-holidays', () => ({
  get bankHolidays() {
    return mockBankHolidays()
  },
}))

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  AGENTS_GOOGLE_GROUPNAME,
  GSSO_TOKEN_NAME,
} = process.env

describe('/api/workOrders/schedule', () => {
  const signedCookie = jsonwebtoken.sign(
    {
      groups: [AGENTS_GOOGLE_GROUPNAME],
    },
    HACKNEY_JWT_SECRET
  )

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': REPAIRS_SERVICE_API_KEY,
    'x-hackney-user': signedCookie,
  }

  describe('a POST request', () => {
    describe('for an immediate priority work order', () => {
      const dateTime = new Date('Monday 28 June 2021 17:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      test('sends the request to the service API with a requiredCompletionDateTime inserted', async () => {
        const req = createRequest({
          method: 'post',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {},
          body: {
            priority: {
              priorityCode: 1,
            },
          },
        })

        const res = createResponse()

        axios.create = jest.fn(() => axios)

        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: {},
          })
        )

        await scheduleEndpoint(req, res)

        expect(axios).toHaveBeenCalledTimes(1)

        const expectedDateTime = new Date(
          dateTime.setHours(dateTime.getHours() + 2)
        )

        expect(axios).toHaveBeenCalledWith({
          method: 'post',
          headers,
          url: `${REPAIRS_SERVICE_API_URL}/workOrders/schedule`,
          params: {},
          paramsSerializer: paramsSerializer,
          data: {
            priority: {
              priorityCode: 1,
              requiredCompletionDateTime: expectedDateTime,
            },
          },
        })

        expect(res._getStatusCode()).toBe(200)
      })
    })

    describe('for a normal priority work order with imminent bank holidays', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)

        mockBankHolidays.mockReturnValue({
          'england-and-wales': {
            division: 'england-and-wales',
            events: [
              {
                title: 'Fake bank holiday',
                date: '2021-06-28', // the following Monday
                notes: '',
                bunting: true,
              },
              {
                title: 'Fake bank holiday',
                date: '2021-07-26',
                notes: '',
                bunting: true,
              },
            ],
          },
        })
      })

      afterEach(() => {
        MockDate.reset()
      })

      test('sends the request to the service API with a requiredCompletionDateTime inserted', async () => {
        const req = createRequest({
          method: 'post',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {},
          body: {
            priority: {
              priorityCode: 4,
            },
          },
        })

        const res = createResponse()

        axios.create = jest.fn(() => axios)

        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: {},
          })
        )

        await scheduleEndpoint(req, res)

        expect(axios).toHaveBeenCalledTimes(1)

        const expectedDateTime = new Date('Wednesday 28 July 2021 09:00:00Z')

        expect(axios).toHaveBeenCalledWith({
          method: 'post',
          headers,
          url: `${REPAIRS_SERVICE_API_URL}/workOrders/schedule`,
          params: {},
          paramsSerializer: paramsSerializer,
          data: {
            priority: {
              priorityCode: 4,
              requiredCompletionDateTime: expectedDateTime,
            },
          },
        })

        expect(res._getStatusCode()).toBe(200)
      })
    })

    describe('for a request with an invalid priority code', () => {
      test('returns a suitable status code and message', async () => {
        const req = createRequest({
          method: 'post',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['workOrders'],
          },
          body: {
            priority: {
              priorityCode: -999,
            },
          },
        })

        const res = createResponse()

        await scheduleEndpoint(req, res)

        expect(res._getStatusCode()).toBe(HttpStatus.BAD_REQUEST)
        expect(res._getJSONData()).toEqual({
          message: 'Priority code missing or invalid',
        })
      })
    })
  })
})

import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '../../../utils/urls'
import MockDate from 'mockdate'
import { readFile, writeFile } from 'fs/promises'

import scheduleEndpoint from './schedule.js'

jest.mock('axios')
jest.mock('fs/promises')
jest.mock('fs')

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  TEMP_BANK_HOLIDAYS_PATH,
  BANK_HOLIDAYS_API_URL,
} = process.env

describe('/api/workOrders/schedule', () => {
  const signedCookie = jsonwebtoken.sign(
    {
      groups: ['repairs-hub-agents-staging'],
    },
    HACKNEY_JWT_SECRET
  )

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': REPAIRS_SERVICE_API_KEY,
    'x-hackney-user': signedCookie,
  }

  describe('a POST request', () => {
    describe('when bank holiday data has been cached in the tmp directory from previous invocations', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)

        readFile.mockResolvedValue(
          JSON.stringify([
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
          ])
        )
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('forwards the request with completionDateTime inserted', async () => {
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

        expect(writeFile).toHaveBeenCalledTimes(0)

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

    describe('when there is no local cache of bank holiday data', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)

        readFile.mockRejectedValue(new Error())
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('fetches bank holidays from the API, writes them to the cache file, and forwards the request with completionDateTime inserted', async () => {
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

        const bankHolidayApiResponseData = {
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
        }

        axios.get.mockResolvedValue({
          status: 200,
          data: bankHolidayApiResponseData,
        })

        axios.create = jest.fn(() => axios)

        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: {},
          })
        )

        await scheduleEndpoint(req, res)

        expect(axios.get).toHaveBeenCalledWith(BANK_HOLIDAYS_API_URL)

        expect(writeFile).toHaveBeenCalledWith(
          TEMP_BANK_HOLIDAYS_PATH,
          JSON.stringify([
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
          ])
        )

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

      describe('and there is an error connecting to the API', () => {
        beforeEach(() => {
          axios.get.mockImplementationOnce(() =>
            Promise.reject({
              response: { status: HttpStatus.SERVICE_UNAVAILABLE },
              message: 'API not available',
            })
          )
        })

        it('returns the same error code and a message as a response', async () => {
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

          await scheduleEndpoint(req, res)

          expect(axios).toHaveBeenCalledTimes(0)

          expect(res._getStatusCode()).toBe(HttpStatus.SERVICE_UNAVAILABLE)
          expect(res._getJSONData()).toEqual({
            message: 'Bank holiday API error',
          })
        })
      })
    })

    describe('for a request with an invalid priority code', () => {
      test('returns a suitable status code and message', async () => {
        readFile.mockResolvedValue('[]')

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
          message: 'Invalid priority code -999',
        })
      })
    })
  })
})

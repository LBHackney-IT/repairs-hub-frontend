import { getSorCodes } from './sor-codes'
import mockAxios from '../__mocks__/axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

describe('postRepair', () => {
  it('fetches successfully data from an API', async () => {
    const sorCodes = {
      result: [
        {
          customCode: 'DES5R003',
          customName: 'Immediate plumbing Repair',
          priority: {
            priorityCode: 1,
            description: 'I - Immediate (2 hours)',
          },
          sorContractor: {
            reference: 'H01',
          },
        },
        {
          customCode: 'DES5R004',
          customName: 'Emergency Plumbing Repair',
          priority: {
            priorityCode: 2,
            description: 'E - Emergency (24 hours)',
          },
          sorContractor: {
            reference: 'H01',
          },
        },
      ],
    }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: sorCodes,
      })
    )

    const { status, data } = await getSorCodes()

    expect(status).toEqual(200)
    expect(data).toEqual(sorCodes)

    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${REPAIRS_SERVICE_API_URL}/schedule-of-rates/codes`,
      {
        headers: { 'x-api-key': REPAIRS_SERVICE_API_KEY },
      }
    )
  })
})

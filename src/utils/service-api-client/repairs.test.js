import { postRepair } from './repairs'
import mockAxios from '../__mocks__/axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

describe('postRepair', () => {
  it('posts data successfully to the repairs service API', async () => {
    const raiseRepairFormData = {
      descriptionOfWork: 'This is an urgent test description',
      priority: {
        priorityCode: 2,
        priorityDescription: 'U - Urgent (5 Working days)',
        requiredCompletionDateTime: new Date('2021-01-21T18:16:20.986Z'),
      },
      workClass: {
        workClassCode: 0,
      },
      workElement: [
        {
          rateScheduleItem: [
            { customCode: 'DES5R006', customName: 'Urgent call outs' },
          ],
        },
      ],
    }

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: 12345678,
      })
    )

    const data = await postRepair(raiseRepairFormData)

    expect(data).toEqual(12345678)

    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${REPAIRS_SERVICE_API_URL}/repairs`,
      raiseRepairFormData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': REPAIRS_SERVICE_API_KEY,
        },
      }
    )
  })
})

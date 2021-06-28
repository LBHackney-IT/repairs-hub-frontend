import { buildOperativeAssignmentFormData } from './assign-operatives'

describe('buildOperativeAssignmentFormData', () => {
  it('builds the notes to post to the JobStatusUpdate endpoint in Repairs API', async () => {
    const operatives = [
      {
        id: 1,
        name: 'Operative A',
      },
      {
        id: 2,
        name: 'Operative B',
      },
      {
        id: 3,
        name: 'Operative C',
      },
    ]

    const response = buildOperativeAssignmentFormData('1', operatives)
    expect(response).toEqual({
      relatedWorkOrderReference: {
        id: '1',
      },
      operativesAssigned: [
        {
          identification: {
            number: 1,
          },
        },
        {
          identification: {
            number: 2,
          },
        },
        {
          identification: {
            number: 3,
          },
        },
      ],
      typeCode: '10',
    })
  })
})

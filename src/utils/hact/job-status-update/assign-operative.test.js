import { buildOperativeAssignmentFormData } from './assign-operatives'

describe('buildOperativeAssignmentFormData', () => {
  it('builds the notes to post to the JobStatusUpdate endpoint in Repairs API', async () => {
    const operatives = [
      {
        operative: {
          id: 1,
          name: 'Operative A',
        },
        percentage: '80%',
      },
      {
        operative: {
          id: 2,
          name: 'Operative B',
        },
        percentage: '20%',
      },
      {
        operative: {
          id: 3,
          name: 'Operative C',
        },
        percentage: '-',
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
          calculatedBonus: 80,
        },
        {
          identification: {
            number: 2,
          },
          calculatedBonus: 20,
        },
        {
          identification: {
            number: 3,
          },
          calculatedBonus: 0,
        },
      ],
      typeCode: '10',
    })
  })
})

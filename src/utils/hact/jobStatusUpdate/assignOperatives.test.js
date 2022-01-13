import { buildOperativeAssignmentFormData } from './assignOperatives'

describe('buildOperativeAssignmentFormData', () => {
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
  ]

  it('builds operatives to post to the JobStatusUpdate endpoint in Repairs API', async () => {
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
      ],
      typeCode: '10',
    })
  })

  it('builds operatives with notes to post to the JobStatusUpdate endpoint in Repairs API', async () => {
    const note = 'Assigned operatives: Operative A 80%, Operative B 20%'
    const response = buildOperativeAssignmentFormData('1', operatives, note)
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
      ],
      comments:
        'Work order updated - Assigned operatives: Operative A 80%, Operative B 20%',
      typeCode: '10',
    })
  })
})

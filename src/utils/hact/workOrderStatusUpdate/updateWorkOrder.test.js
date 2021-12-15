import { buildWorkOrderUpdate } from './updateWorkOrder'

describe('buildWorkOrderUpdate', () => {
  const latestTasks = [
    {
      id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
      code: 'XXXX003 - Immediate call outs',
      description: 'Immediate call outs',
      cost: '10',
      quantity: 1,
    },
  ]
  const addedTasks = [
    {
      id: 0,
      code: 'XXXX004 - Emergency call out',
      description: 'Emergency call out',
      quantity: 3.5,
    },
  ]
  const reference = '00012345'
  const variationReason = 'More work is required'
  const notesWhenIsOvertime = 'Overtime, SMVs not included in Bonus'
  const notesWhenNoOvertime = 'Not Overtime, SMVs included in Bonus'
  const isOvertime = true
  const noOvertime = false
  const onOvertimeUpdate = true

  it('builds the WorkOrderUpdate form data to post to the Repairs API', () => {
    const WorkOrderUpdateFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      typeCode: '80',
      comments: 'More work is required',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseFloat('1')],
            },
          },
          {
            customCode: 'XXXX004',
            customName: 'Emergency call out',
            quantity: {
              amount: [Number.parseFloat('3.5')],
            },
          },
        ],
      },
    }

    const response = buildWorkOrderUpdate(
      latestTasks,
      addedTasks,
      reference,
      variationReason
    )

    expect(response).toEqual(WorkOrderUpdateFormData)
  })

  it('builds the WorkOrderUpdate form data to post to the Repairs API without adding comments', () => {
    const WorkOrderUpdateFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      typeCode: '80',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseFloat('1')],
            },
          },
          {
            customCode: 'XXXX004',
            customName: 'Emergency call out',
            quantity: {
              amount: [Number.parseFloat('3.5')],
            },
          },
        ],
      },
    }

    const response = buildWorkOrderUpdate(
      latestTasks,
      addedTasks,
      reference,
      ''
    )
    expect(response.comments).toBeUndefined()
    expect(response).toEqual(WorkOrderUpdateFormData)
  })

  it('builds the WorkOrderUpdate form data to post to the Repairs API with Overtime', () => {
    const WorkOrderUpdateFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      isOvertime: true,
      comments: 'Overtime, SMVs not included in Bonus',
      typeCode: '80',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseFloat('1')],
            },
          },
        ],
      },
    }

    const response = buildWorkOrderUpdate(
      latestTasks,
      [],
      reference,
      notesWhenIsOvertime,
      isOvertime,
      onOvertimeUpdate
    )
    expect(response).toEqual(WorkOrderUpdateFormData)
  })

  it('builds the WorkOrderUpdate form data to post to the Repairs API with No Overtime', () => {
    const WorkOrderUpdateFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      isOvertime: false,
      comments: 'Not Overtime, SMVs included in Bonus',
      typeCode: '80',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseFloat('1')],
            },
          },
        ],
      },
    }

    const response = buildWorkOrderUpdate(
      latestTasks,
      [],
      reference,
      notesWhenNoOvertime,
      noOvertime,
      onOvertimeUpdate
    )
    expect(response).toEqual(WorkOrderUpdateFormData)
  })
})

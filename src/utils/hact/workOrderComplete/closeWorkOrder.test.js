import {
  buildCloseWorkOrderData,
  buildWorkOrderCompleteNotes,
} from './closeWorkOrder'

describe('buildCloseWorkOrderData', () => {
  const completionDate = new Date(
    'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
  )
  const notes = 'hello'
  const reference = '00012346'

  //typeCode 0 for Work Order Completed
  it('builds the ScheduleWorkOrder form data to post to the Repairs API with typeCode 0', async () => {
    const CloseWorkOrderFormData = {
      workOrderReference: {
        id: reference,
        description: '',
        allocatedBy: '',
      },
      jobStatusUpdates: [
        {
          typeCode: '0',
          otherType: 'complete',
          comments: `Work order closed - ${notes}`,
          eventTime: completionDate,
        },
      ],
    }

    const response = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      'Work Order Completed'
    )
    expect(response).toEqual(CloseWorkOrderFormData)
  })

  //typeCode 70 for No Access
  it('builds the ScheduleWorkOrder form data to post to the Repairs API with typeCode 70', async () => {
    const CloseWorkOrderFormData = {
      workOrderReference: {
        id: reference,
        description: '',
        allocatedBy: '',
      },
      jobStatusUpdates: [
        {
          typeCode: '70',
          otherType: 'complete',
          comments: `Work order closed - ${notes}`,
          eventTime: completionDate,
        },
      ],
    }

    const response = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      'No Access'
    )
    expect(response).toEqual(CloseWorkOrderFormData)
  })
})

describe('buildWorkOrderCompleteNotes', () => {
  describe('when there are operative percentages', () => {
    describe('and isOvertime is false', () => {
      it('includes names and percentages in the note', () => {
        expect(
          buildWorkOrderCompleteNotes(
            'Comment from user',
            [
              { operative: { name: 'operativeA' }, percentage: 'percentage1' },
              { operative: { name: 'operativeB' }, percentage: 'percentage2' },
            ],
            false
          )
        ).toEqual(
          'Comment from user - Assigned operatives operativeA : percentage1, operativeB : percentage2'
        )
      })
    })

    describe('and isOvertime is true', () => {
      it('includes names without percentages and mentions overtime in the note', () => {
        expect(
          buildWorkOrderCompleteNotes(
            'Comment from user',
            [
              { operative: { name: 'operativeA' }, percentage: 'percentage1' },
              { operative: { name: 'operativeB' }, percentage: 'percentage2' },
            ],
            true
          )
        ).toEqual(
          'Comment from user - Assigned operatives operativeA, operativeB - Overtime'
        )
      })
    })
  })

  describe('when there are no operative percentages', () => {
    describe('and isOvertime is true', () => {
      it('mentions overtime in the notes', () => {
        expect(
          buildWorkOrderCompleteNotes('Comment from user', {}, true)
        ).toEqual('Comment from user - Overtime')
      })
    })
  })
})

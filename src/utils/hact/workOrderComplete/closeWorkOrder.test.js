import {
  buildCloseWorkOrderData,
  buildWorkOrderCompleteNotes,
} from './closeWorkOrder'

describe('buildCloseWorkOrderData', () => {
  const completionDate = new Date()

  it('builds form data with workOrderReference and jobStatusUpdate attributes', () => {
    expect(
      buildCloseWorkOrderData(
        completionDate,
        'A note',
        '00000001',
        'Reason',
        'Payment type string'
      )
    ).toEqual({
      workOrderReference: { id: '00000001', description: '', allocatedBy: '' },
      jobStatusUpdates: [
        {
          typeCode: '0',
          otherType: 'completed',
          comments: 'Work order closed - A note',
          eventTime: completionDate,
          paymentType: 'Payment type string',
        },
      ],
    })
  })

  it('has a typeCode of 0 when supplied a reason of "Work Order Completed"', () => {
    const response = buildCloseWorkOrderData(
      null,
      null,
      null,
      'Work Order Completed'
    )
    expect(response.jobStatusUpdates[0].typeCode).toEqual('0')
  })

  it('has a typeCode of 70 when supplied a reason of "No Access"', () => {
    const response = buildCloseWorkOrderData(null, null, null, 'No Access')
    expect(response.jobStatusUpdates[0].typeCode).toEqual('70')
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

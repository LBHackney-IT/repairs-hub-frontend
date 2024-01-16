import {
  buildCloseWorkOrderData,
  buildDampAndMouldReportData,
  buildWorkOrderCompleteNotes,
} from './closeWorkOrder'

describe.only('buildDampAndMouldReportData', () => {
  describe('dampAndMouldPresenceConfirmed', () => {
    ;[
      {
        value: 'Yes',
        expectedOutput: true,
        testDescription: 'It sets the value as true',
      },
      {
        value: 'Not sure',
        expectedOutput: false,
        testDescription: 'It sets the value as false',
      },
    ].forEach(({ value, expectedOutput, testDescription }) => {
      it(testDescription, () => {
        // Arrange

        // Act
        const result = buildDampAndMouldReportData(value, '', '', '')

        // Assert
        expect(result.dampAndMouldPresenceConfirmed).toEqual(expectedOutput)
      })
    })
  })

  describe('previouslyReported', () => {
    ;[
      {
        value: 'Yes',
        expectedOutput: true,
        testDescription: 'It sets the value as true',
      },
      {
        value: 'No',
        expectedOutput: false,
        testDescription: 'It sets the value as false',
      },
    ].forEach(({ value, expectedOutput, testDescription }) => {
      it(testDescription, () => {
        // Arrange

        // Act
        const result = buildDampAndMouldReportData('', value, '', '')

        // Assert
        expect(result.previouslyReported).toEqual(expectedOutput)
      })
    })
  })

  // Comments
  describe('comments', () => {
    it('should include comments', () => {
      // Arrange
      const comments = 'Comments'

      // Act
      const result = buildDampAndMouldReportData('', '', '', comments)

      // Assert
      expect(result.comments).toEqual(comments)
    })
  })

  // previousReportResolved ("YES")
  // not resolved ("NO")

  describe('previousReportResolved', () => {
    ;[
      {
        value: 'Yes',
        previouslyReportedValue: 'Yes',
        expectedOutput: true,
        testDescription: 'It sets the value as true',
      },
      {
        value: 'Yes',
        previouslyReportedValue: 'No',
        expectedOutput: false,
        testDescription:
          'It sets the value as false if not previously reported',
      },
      {
        value: 'No',
        previouslyReportedValue: 'Yes',
        expectedOutput: false,
        testDescription: 'It sets the value as false',
      },
    ].forEach(
      ({ value, expectedOutput, testDescription, previouslyReportedValue }) => {
        it(testDescription, () => {
          // Arrange

          // Act
          const result = buildDampAndMouldReportData(
            '',
            previouslyReportedValue,
            value,
            ''
          )

          // Assert

          if (previouslyReportedValue === 'No') {
            expect(result).not.toHaveProperty('previousReportResolved')
          } else {
            expect(result.previousReportResolved).toEqual(expectedOutput)
          }
        })
      }
    )
  })
})

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
    describe('and paymentType is Bonus', () => {
      it('includes names and percentages in the note', () => {
        expect(
          buildWorkOrderCompleteNotes(
            'Comment from user',
            [
              { operative: { name: 'operativeA' }, percentage: 'percentage1' },
              { operative: { name: 'operativeB' }, percentage: 'percentage2' },
            ],
            'Bonus'
          )
        ).toEqual(
          'Comment from user - Assigned operatives operativeA : percentage1, operativeB : percentage2 - Bonus calculation'
        )
      })
    })

    describe('and paymentType is Overtime', () => {
      it('includes overtime in the note but not percentages', () => {
        expect(
          buildWorkOrderCompleteNotes(
            'Comment from user',
            [
              { operative: { name: 'operativeA' }, percentage: 'percentage1' },
              { operative: { name: 'operativeB' }, percentage: 'percentage2' },
            ],
            'Overtime'
          )
        ).toEqual(
          'Comment from user - Assigned operatives operativeA, operativeB - Overtime work order (SMVs not included in Bonus)'
        )
      })
    })

    describe('and paymentType is CloseToBase', () => {
      it('includes close to base in the note', () => {
        expect(
          buildWorkOrderCompleteNotes(
            'Comment from user',
            [
              { operative: { name: 'operativeA' }, percentage: 'percentage1' },
              { operative: { name: 'operativeB' }, percentage: 'percentage2' },
            ],
            'CloseToBase'
          )
        ).toEqual(
          'Comment from user - Assigned operatives operativeA : percentage1, operativeB : percentage2 - Close to base (Operative payment made)'
        )
      })
    })
  })

  describe('when there are no operative percentages', () => {
    describe('and paymentType is null', () => {
      it('returns the notes only', () => {
        expect(
          buildWorkOrderCompleteNotes('Comment from user', {}, null)
        ).toEqual('Comment from user')
      })
    })
  })
})

const {
  formatWorkOrderReferences,
  getInvalidWorkOrderReferences,
  formatInvalidWorkOrderReferencesError,
  dateIsInFuture,
} = require('./utils')

describe('CloseWorkOrders', () => {
  it('formatWorkOrderReferences returns list of workOrder references', () => {
    // Arrange
    const workOrderReferences = `
         klj
         sdedfsdf
         222
         22222222`

    // Act
    const response = formatWorkOrderReferences(workOrderReferences)

    // Assert
    const expectedResponse = ['klj', 'sdedfsdf', '222', '22222222']

    expect(response).toEqual(expectedResponse)
  })

  it('getInvalidWorkOrderReferences returns invalid workOrderReferences', () => {
    // Arrange
    const workOrderReferences = ['klj', 'sdedfsdf', '222', '22222222']

    // Act
    const response = getInvalidWorkOrderReferences(workOrderReferences)

    // Assert
    expect(response).toHaveLength(3)
    expect(response[0]).toEqual('"klj"')
    expect(response[1]).toEqual('"sdedfsdf"')
    expect(response[2]).toEqual('"222"')
  })

  it('formatInvalidWorkOrderReferencesError returns error message', () => {
    // Arrange
    const invalidWorkOrderReferences = ['aaa', 'bbb', '1234']

    // Act
    const response = formatInvalidWorkOrderReferencesError(
      invalidWorkOrderReferences
    )

    // Assert
    const expectedResponse = `Invalid WorkOrder Reference(s) entered: aaa, bbb, 1234`
    expect(response).toEqual(expectedResponse)
  })

  it('dateIsInFuture returns true if date is in future', () => {
    // Arrange
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    // Act
    const response = dateIsInFuture(futureDate)

    // Assert
    expect(response).toBe(true)
  })

  it('dateIsInFuture returns false if date is in past', () => {
    // Arrange
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)

    // Act
    const response = dateIsInFuture(pastDate)

    // Assert
    expect(response).toBe(false)
  })
})

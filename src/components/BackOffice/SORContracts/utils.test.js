const {
  validatePropertyReference,
  copyContractsSelected,
  addContractsSelected,
  dataToRequestObject,
  propertyReferencesMatch,
} = require('./utils')

describe('SOR Contracts', () => {
  describe('validatePropertyReference', () => {
    it('returns true when valid property reference', () => {
      // Arrange
      const propertyReference = '12345678'

      // Act
      const response = validatePropertyReference(propertyReference)

      // Assert
      expect(response).toBe(true)
    })

    it('returns false when invalid property reference', () => {
      // Arrange
      const propertyReference = '123456785'

      // Act
      const response = validatePropertyReference(propertyReference)

      // Assert
      expect(response).toBe(false)
    })
  })

  describe('copyContractsSelected', () => {
    it('returns true', () => {
      // Arrange

      // Act
      const response = copyContractsSelected('Copy')

      // Assert
      expect(response).toBe(true)
    })

    it('returns false', () => {
      // Arrange

      // Act
      const response = copyContractsSelected('Add')

      // Assert
      expect(response).toBe(false)
    })
  })

  describe('addContractsSelected', () => {
    it('returns true', () => {
      // Arrange

      // Act
      const response = addContractsSelected('Add')

      // Assert
      expect(response).toBe(true)
    })

    it('returns false', () => {
      // Arrange

      // Act
      const response = addContractsSelected('Copy')

      // Assert
      expect(response).toBe(false)
    })
  })

  describe('dataToRequestObject', () => {
    it('returns request object', () => {
      // Arrange
      const sourcePropertyReference = '  123 323  '
      const destinationPropertyReference = '123343   33'
      const selectedContract = 'CONTRACT_REF'
      const selectedOption = 'ADD'

      // Act
      const response = dataToRequestObject(
        sourcePropertyReference,
        destinationPropertyReference,
        selectedContract,
        selectedOption
      )

      // Assert
      expect(response.sourcePropertyReference).toBe('123323')
      expect(response.destinationPropertyReference).toBe('12334333')
      expect(response.contractReference).toBe(selectedContract)
      expect(response.mode).toBe(selectedOption)
    })
  })

  describe('propertyReferencesMatch', () => {
    //

    it('returns true when both values match', () => {
      // Arrange
      const propertyReference1 = '  1234  56 '
      const propertyReference2 = '12345   6'

      // Act
      const response = propertyReferencesMatch(
        propertyReference1,
        propertyReference2
      )

      // Assert
      expect(response).toBe(true)
    })
  })
})

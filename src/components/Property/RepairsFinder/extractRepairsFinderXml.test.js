import extractRepairsFinderXml from './extractRepairsFinderXml'
import { faker } from '@faker-js/faker'

describe('extractRepairsFinderXml', () => {
  describe('when the code is invalid', () => {
    it('should return error when empty input', async () => {
      // Arrange
      var textInput = ''

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })

    it('should return error when quantity missing', async () => {
      // Arrange
      var textInput =
        '<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>'

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })

    it('should return error when priority missing', async () => {
      // Arrange
      var textInput =
        '<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>'

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })

    it('should return error when sorCode missing', async () => {
      // Arrange
      var textInput =
        '<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>'

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })

    it('should return error when comments missing', async () => {
      // Arrange
      var textInput =
        '<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>'

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })

    it('should return error when contractor reference missing', async () => {
      // Arrange
      var textInput =
        '<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>'

      // Act
      var result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid code format')
      expect(result.result).toBe(null)
    })
  })

  describe('when the code is valid', () => {
    it('should extract all values', async () => {
      // Arrange
      const priority = faker.string.alpha({ length: { min: 2, max: 10 } })
      const quantity = faker.number.int({ min: 1, max: 100 })
      const code = faker.string.alphanumeric(8)
      const comments = faker.string.alphanumeric({
        length: { min: 10, max: 200 },
      })
      const contractorReference = faker.string.alphanumeric(3)

      const textInput = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>${contractorReference}</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>${code}</SOR_CODE><PRIORITY>${priority}</PRIORITY><QUANTITY>${quantity}</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>${comments}</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`

      // Act
      const result = await extractRepairsFinderXml(textInput)

      // Assert
      expect(result.success).toBe(true)
      expect(result.error).toBe(null)

      expect(result.result.priority).toBe(priority)
      expect(result.result.quantity).toBe(`${quantity}`)
      expect(result.result.sorCode).toBe(code)
      expect(result.result.comments).toBe(comments)
      expect(result.result.contractorReference).toBe(contractorReference)
    })
  })
})

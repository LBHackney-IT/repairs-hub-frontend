import { SorCodeValidator } from './SorCodeValidator'

describe('sorCodeValidator', () => {
  describe('when supplied an empty list of codes', () => {
    const sorCodeValidator = new SorCodeValidator({
      currentSorCodes: [],
      sorCodesToValidate: [],
      additionalValidationCallback: async () => ({
        validCodes: [],
        invalidCodes: [],
      }),
    })

    it('validate() returns true', async () => {
      expect(await sorCodeValidator.validate()).toEqual(true)
    })

    it('.errors returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.errors).toEqual([])
    })

    it('.validatedCodeSet returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.validatedCodeSet).toEqual([])
    })
  })

  describe('when all the supplied codes are invalid formats', () => {
    const sorCodeValidator = new SorCodeValidator({
      currentSorCodes: [],
      sorCodesToValidate: [
        '',
        '1',
        '123456789',
        '123 5678',
        ' 2345678',
        '123456 8',
      ],
      additionalValidationCallback: () => ({
        validCodes: [],
        invalidCodes: [],
      }),
    })

    it('validate() returns false', async () => {
      expect(await sorCodeValidator.validate()).toEqual(false)
    })

    it('.errors returns an array of invalid codes and messages after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.errors).toEqual([
        { code: '', message: 'Invalid SOR code format' },
        { code: '1', message: 'Invalid SOR code format' },
        { code: '123456789', message: 'Invalid SOR code format' },
        { code: '123 5678', message: 'Invalid SOR code format' },
        { code: ' 2345678', message: 'Invalid SOR code format' },
        { code: '123456 8', message: 'Invalid SOR code format' },
      ])
    })

    it('.validatedCodeSet returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.validatedCodeSet).toEqual([])
    })
  })

  describe('when the supplied codes are a mix of valid and invalid formats', () => {
    const validationCallback = jest.fn(() => ({
      validCodes: [
        {
          code: '12345678',
        },
      ],
      invalidCodes: [],
    }))

    const sorCodeValidator = new SorCodeValidator({
      currentSorCodes: [],
      sorCodesToValidate: ['1', '12345678'],
      additionalValidationCallback: validationCallback,
    })

    it('validate() returns false', async () => {
      expect(await sorCodeValidator.validate()).toEqual(false)
    })

    it('.errors returns an array of invalid codes and messages after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.errors).toEqual([
        { code: '1', message: 'Invalid SOR code format' },
      ])
    })

    it('the additional validation callback is called with codes that have valid formats', async () => {
      await sorCodeValidator.validate()

      expect(validationCallback).toHaveBeenCalledWith(['12345678'])
    })

    it('.validatedCodeSet returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.validatedCodeSet).toEqual([])
    })
  })

  describe('when there is a mix of invalid format codes, duplicated codes, codes which fail additional validation and valid codes', () => {
    const sorCodeValidator = new SorCodeValidator({
      currentSorCodes: [],
      sorCodesToValidate: ['12345678', 'ABCDEFGH', 'ABCD5678', '1', '1', ''],
      additionalValidationCallback: async () => ({
        validCodes: [
          { code: '12345678', shortDescription: 'shortDescription1', cost: 1 },
        ],
        invalidCodes: ['ABCDEFGH', 'ABCD5678'],
      }),
    })

    it('validate() returns false', async () => {
      expect(await sorCodeValidator.validate()).toEqual(false)
    })

    it('.errors returns an array of invalid codes and messages after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.errors).toEqual([
        { code: 'ABCDEFGH', message: 'SOR code does not exist' },
        { code: 'ABCD5678', message: 'SOR code does not exist' },
        { code: '1', message: 'Invalid SOR code format' },
        { code: '1', message: 'Invalid SOR code format' },
        { code: '', message: 'Invalid SOR code format' },
      ])
    })

    it('.validatedCodeSet returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.validatedCodeSet).toEqual([])
    })
  })

  describe('when there are supplied codes and all are valid', () => {
    const sorCodeValidator = new SorCodeValidator({
      currentSorCodes: [],
      sorCodesToValidate: ['12345678', 'ABCDEFGH', 'ABCD5678'],
      additionalValidationCallback: async () => ({
        validCodes: [
          { code: '12345678' },
          { code: 'ABCDEFGH' },
          { code: 'ABCD5678' },
        ],
        invalidCodes: [],
      }),
    })

    it('validate() returns true', async () => {
      expect(await sorCodeValidator.validate()).toEqual(true)
    })

    it('.errors returns an empty array after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.errors).toEqual([])
    })

    it('.validatedCodeSet returns an array of all valid codes after validation', async () => {
      await sorCodeValidator.validate()

      expect(sorCodeValidator.validatedCodeSet).toEqual([
        { code: '12345678' },
        { code: 'ABCDEFGH' },
        { code: 'ABCD5678' },
      ])
    })
  })

  describe('duplicate SOR codes', () => {
    describe('when all supplied codes are valid formats but some duplicate the currentSorCodes', () => {
      const sorCodeValidator = new SorCodeValidator({
        currentSorCodes: ['12345678', 'ABCDEFGH', 'somecode'],
        sorCodesToValidate: ['12345678', 'ABCDEFGH', 'ABCD5678'],
        additionalValidationCallback: async () => ({
          validCodes: [
            {
              code: '12345678',
            },
            {
              code: 'ABCDEFGH',
            },
            {
              code: 'ABCD5678',
            },
          ],
          invalidCodes: [],
        }),
      })

      it('validate() returns true', async () => {
        expect(await sorCodeValidator.validate()).toEqual(true)
      })

      it('.errors returns an empty array after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.errors).toEqual([])
      })

      it('.validatedCodeSet returns the deduplicated codes after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.validatedCodeSet).toEqual([
          {
            code: 'ABCD5678',
          },
        ])
      })

      it('.duplicateCodes returns the duplicated codes after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.duplicateCodes).toEqual([
          '12345678',
          'ABCDEFGH',
        ])
      })
    })

    describe('when all the supplied codes are valid formats but contain duplicates within the same array', () => {
      const sorCodeValidator = new SorCodeValidator({
        currentSorCodes: [],
        sorCodesToValidate: [
          '12345678',
          '12345678',
          'ABCDEFGH',
          '12345678',
          'ABCD1234',
        ],
        additionalValidationCallback: async () => ({
          validCodes: [
            {
              code: '12345678',
            },
            {
              code: 'ABCDEFGH',
            },
            {
              code: 'ABCD1234',
            },
          ],
          invalidCodes: [],
        }),
      })

      it('validate() returns true', async () => {
        expect(await sorCodeValidator.validate()).toEqual(true)
      })

      it('.errors returns an empty array after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.errors).toEqual([])
      })

      it('.validatedCodeSet returns the deduplicated codes after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.validatedCodeSet).toEqual([
          {
            code: '12345678',
          },
          {
            code: 'ABCDEFGH',
          },
          {
            code: 'ABCD1234',
          },
        ])
      })

      it('.duplicateCodes returns the duplicated codes after validation', async () => {
        await sorCodeValidator.validate()

        expect(sorCodeValidator.duplicateCodes).toEqual(['12345678'])
      })
    })
  })
})

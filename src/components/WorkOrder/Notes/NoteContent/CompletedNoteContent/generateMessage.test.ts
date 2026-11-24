import generateMessage from './generateMessage'

const completionDate = new Date('2026-11-24T13:54:00Z')
const formattedDate = completionDate.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const operative = (name: string, jobPercentage: number) => ({
  name,
  jobPercentage,
})

describe('generateMessage', () => {
  describe('base message', () => {
    it('returns only the status when nothing else is provided', () => {
      expect(generateMessage('', null, [], '')).toBe('Closed - Completed')
    })

    it('appends the formatted completion date', () => {
      expect(generateMessage('', completionDate, [], '')).toBe(
        `Closed - Completed: ${formattedDate}`
      )
    })

    it('omits the date when the completion date is null', () => {
      expect(generateMessage('', null, [], '')).not.toContain(':')
    })
  })

  describe('user comments', () => {
    it('appends the trimmed comment', () => {
      expect(generateMessage('  some note  ', null, [], '')).toBe(
        'Closed - Completed - some note'
      )
    })

    it.each(['', '   ', null, undefined])(
      'ignores an empty comment (%p)',
      (comment) => {
        expect(generateMessage(comment as string, null, [], '')).toBe(
          'Closed - Completed'
        )
      }
    )
  })

  describe('operatives', () => {
    it('shows a single operative with their percentage', () => {
      expect(generateMessage('', null, [operative('Alice', 100)], '')).toBe(
        'Closed - Completed - Assigned operatives Alice: 100%'
      )
    })

    it('comma-joins multiple operatives with percentages', () => {
      expect(
        generateMessage(
          '',
          null,
          [operative('Alice', 60), operative('Bob', 40)],
          ''
        )
      ).toBe('Closed - Completed - Assigned operatives Alice: 60%, Bob: 40%')
    })

    it('hides percentages for the Overtime payment type', () => {
      expect(
        generateMessage(
          '',
          null,
          [operative('Alice', 60), operative('Bob', 40)],
          'Overtime'
        )
      ).toBe(
        'Closed - Completed - Assigned operatives Alice, Bob - Overtime work order (SMVs not included in Bonus)'
      )
    })

    it('omits the operatives fragment when there are none', () => {
      expect(generateMessage('', null, [], '')).not.toContain('operatives')
    })
  })

  describe('payment type', () => {
    it.each([
      ['Bonus', 'Bonus calculation'],
      ['Overtime', 'Overtime work order (SMVs not included in Bonus)'],
      ['CloseToBase', 'Close to base (Operative payment made)'],
    ])('adds the message for %s', (paymentType, expected) => {
      expect(generateMessage('', null, [], paymentType)).toBe(
        `Closed - Completed - ${expected}`
      )
    })

    it('adds nothing for an empty payment type', () => {
      expect(generateMessage('', null, [], '')).toBe('Closed - Completed')
    })
  })

  describe('when approval is required to complete', () => {
    it('uses the pending approval status', () => {
      expect(generateMessage('', null, [], '', true)).toBe(
        'Closed - Completion pending approval'
      )
    })

    it('does not mention bonus calculation', () => {
      expect(generateMessage('', null, [], 'Bonus', true)).not.toContain(
        'Bonus calculation'
      )
    })

    it('still includes date, comment and operatives', () => {
      expect(
        generateMessage(
          'a note',
          completionDate,
          [operative('Alice', 100)],
          'Bonus',
          true
        )
      ).toBe(
        `Closed - Completion pending approval: ${formattedDate} - a note - Assigned operatives Alice: 100%`
      )
    })

    it('defaults to not requiring approval', () => {
      expect(generateMessage('', null, [], 'Bonus')).toBe(
        'Closed - Completed - Bonus calculation'
      )
    })
  })

  it('orders status, date, comment, operatives, payment type', () => {
    expect(
      generateMessage(
        'a note',
        completionDate,
        [operative('Alice', 100)],
        'Bonus'
      )
    ).toBe(
      `Closed - Completed: ${formattedDate} - a note - Assigned operatives Alice: 100% - Bonus calculation`
    )
  })
})

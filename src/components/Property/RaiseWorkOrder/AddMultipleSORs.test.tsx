import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddMultipleSORs from './AddMultipleSORs'

// The parser has its own tests, so these focus on how the component uses it:
// when it validates, what it shows, what it calls and what it sends.

const sor = (code: string) => ({
  code,
  shortDescription: `Description of ${code}`,
  cost: 10,
})

const existingCodes = ['00000001', '00000002', '00000003', '00000004']

const defaultExistenceValidation = async (codes: string[]) => ({
  validCodes: codes.filter((c) => existingCodes.includes(c)).map(sor),
  invalidCodes: codes.filter((c) => !existingCodes.includes(c)),
})

const setup = (props = {}) => {
  const callbacks = {
    setPageBackToFormView: jest.fn(),
    sorExistenceValidationCallback: jest.fn(defaultExistenceValidation),
    setSorCodesFromBatchUpload: jest.fn(),
    setAnnouncementMessage: jest.fn(),
    setIsPriorityEnabled: jest.fn(),
  }

  render(<AddMultipleSORs currentSorCodes={[]} {...callbacks} {...props} />)

  return callbacks
}

const getEditor = () =>
  screen.getByLabelText('Enter SOR codes as a list:') as HTMLTextAreaElement

const enterText = (text: string) =>
  fireEvent.change(getEditor(), { target: { value: text } })

const submit = async () =>
  userEvent.click(screen.getByRole('button', { name: 'Add SOR codes' }))

const errorItems = () =>
  Array.from(document.querySelectorAll('.sor-code-editor-errors__item')).map(
    (item) => item.textContent
  )

// the text of each highlighted line, without its line number
const highlightedLines = () =>
  Array.from(document.querySelectorAll('.sor-code-editor__line--invalid')).map(
    (line) =>
      Array.from(line.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join('')
  )

const waitForUpload = (callbacks) =>
  waitFor(() => expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalled())

describe('AddMultipleSORs', () => {
  describe('rendering', () => {
    it('renders example lines in the editor', () => {
      setup()

      expect(document.querySelector('pre')).toMatchSnapshot()
    })

    it('does not show any errors before the first submit', () => {
      setup()

      enterText('not a code\n00000001\n00000001')

      expect(errorItems()).toEqual([])
      expect(highlightedLines()).toEqual([])
    })
  })

  describe('back link', () => {
    it('clears any batch codes and returns to the form without validating', async () => {
      const callbacks = setup()

      enterText('00000001')
      await userEvent.click(screen.getByText('Back'))

      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledWith([])
      expect(callbacks.setPageBackToFormView).toHaveBeenCalledTimes(1)
      expect(callbacks.sorExistenceValidationCallback).not.toHaveBeenCalled()
    })
  })

  describe('submitting nothing', () => {
    it.each([
      ['empty', ''],
      ['whitespace only', '  \n\t\n   '],
    ])('shows a required error when the input is %s', async (_, text) => {
      const callbacks = setup()

      enterText(text)
      await submit()

      expect(
        await screen.findByText(/Please enter SOR codes/)
      ).toBeInTheDocument()
      expect(callbacks.sorExistenceValidationCallback).not.toHaveBeenCalled()
      expect(callbacks.setSorCodesFromBatchUpload).not.toHaveBeenCalled()
      expect(callbacks.setPageBackToFormView).not.toHaveBeenCalled()
    })

    it('clears the required error once something is entered', async () => {
      setup()

      await submit()
      expect(
        await screen.findByText(/Please enter SOR codes/)
      ).toBeInTheDocument()

      enterText('00000001')

      await waitFor(() =>
        expect(screen.queryByText(/Please enter SOR codes/)).toBeNull()
      )
    })
  })

  describe('when the input has errors the parser can find', () => {
    const input = [
      '00000001',
      '0000000',
      '00000002 abc',
      '00000003',
      '00000003 2',
    ].join('\n')

    it('makes no request, adds nothing and stays on the page', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(callbacks.sorExistenceValidationCallback).not.toHaveBeenCalled()
      expect(callbacks.setSorCodesFromBatchUpload).not.toHaveBeenCalled()
      expect(callbacks.setPageBackToFormView).not.toHaveBeenCalled()
      expect(callbacks.setIsPriorityEnabled).not.toHaveBeenCalled()
    })

    it('lists the errors, duplicates first, against the right line numbers', async () => {
      setup()

      enterText(input)
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(errorItems()).toEqual([
        'Lines 4 and 5: 00000003 Duplicate SOR code',
        'Line 2: 0000000 Invalid SOR code format',
        'Line 3: 00000002 abc Quantity must be a whole number',
      ])
    })

    it('highlights every line involved, but not the valid ones', async () => {
      setup()

      enterText(input)
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(document.querySelector('pre')).toMatchSnapshot()
    })

    it('keeps errors in step with edits without needing another submit', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()
      await screen.findByText('Please correct the highlighted lines')

      enterText('00000001\n00000002 abc\n00000003\n00000003 2')
      expect(errorItems()).toEqual([
        'Lines 3 and 4: 00000003 Duplicate SOR code',
        'Line 2: 00000002 abc Quantity must be a whole number',
      ])

      enterText('00000001\n00000002\n00000003')
      expect(errorItems()).toEqual([])
      expect(
        screen.queryByText('Please correct the highlighted lines')
      ).toBeNull()
      expect(highlightedLines()).toEqual([])
      expect(callbacks.sorExistenceValidationCallback).not.toHaveBeenCalled()
    })

    it('treats codes already on the form as errors', async () => {
      const callbacks = setup({ currentSorCodes: ['00000001'] })

      enterText('00000001\n00000002')
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(errorItems()).toEqual([
        'Line 1: 00000001 SOR code has already been added to the form',
      ])
      expect(callbacks.sorExistenceValidationCallback).not.toHaveBeenCalled()
    })
  })

  describe('when the input passes the local checks', () => {
    it('checks only the codes exist, without quantities, in the order entered', async () => {
      const callbacks = setup()

      enterText('00000003 5\n\n00000001\n00000002 2')
      await submit()

      await waitForUpload(callbacks)
      expect(callbacks.sorExistenceValidationCallback).toHaveBeenCalledTimes(1)
      expect(callbacks.sorExistenceValidationCallback).toHaveBeenCalledWith([
        '00000003',
        '00000001',
        '00000002',
      ])
    })

    it('uploads the codes in the order entered, each with its quantity, defaulting to 1', async () => {
      const callbacks = setup()

      enterText('00000003 5\n00000001\n00000002 12')
      await submit()

      await waitForUpload(callbacks)
      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledTimes(1)
      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledWith([
        { ...sor('00000003'), quantity: '5' },
        { ...sor('00000001'), quantity: '1' },
        { ...sor('00000002'), quantity: '12' },
      ])
    })

    it('then enables priority, clears the announcement and returns to the form', async () => {
      const callbacks = setup()

      enterText('00000001')
      await submit()

      await waitForUpload(callbacks)
      expect(callbacks.setIsPriorityEnabled).toHaveBeenCalledWith(true)
      expect(callbacks.setAnnouncementMessage).toHaveBeenCalledWith('')
      expect(callbacks.setPageBackToFormView).toHaveBeenCalledTimes(1)
    })

    it('accepts pasted text separated by tabs, windows line endings and extra spaces', async () => {
      const callbacks = setup()

      await userEvent.click(getEditor())
      await userEvent.paste('  00000001\t3  \r\n00000002     4\r\n')
      await submit()

      await waitForUpload(callbacks)
      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledWith([
        { ...sor('00000001'), quantity: '3' },
        { ...sor('00000002'), quantity: '4' },
      ])
    })

    it('disables the button and shows a spinner while the codes are checked', async () => {
      let finishRequest: (value: unknown) => void
      const callbacks = setup({
        sorExistenceValidationCallback: jest.fn(
          () => new Promise((resolve) => (finishRequest = resolve))
        ),
      })

      enterText('00000001')
      await submit()

      const button = await screen.findByRole('button', {
        name: 'Add SOR codes',
      })
      await screen.findByTestId('spinner-undefined')
      expect(button).toBeDisabled()
      expect(callbacks.setSorCodesFromBatchUpload).not.toHaveBeenCalled()

      await act(async () =>
        finishRequest({ validCodes: [sor('00000001')], invalidCodes: [] })
      )

      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledTimes(1)
    })
  })

  describe('when some codes do not exist', () => {
    const input = '00000001\n\n99999999 2\n00000002\n88888888'

    it('adds nothing and lists the missing codes against their original line numbers', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(errorItems()).toEqual([
        'Line 3: 99999999 2 SOR code does not exist',
        'Line 5: 88888888 SOR code does not exist',
      ])
      expect(highlightedLines()).toHaveLength(2)
      expect(callbacks.setSorCodesFromBatchUpload).not.toHaveBeenCalled()
      expect(callbacks.setPageBackToFormView).not.toHaveBeenCalled()
      expect(getEditor()).toHaveFocus()
    })

    it('re-enables the button afterwards', async () => {
      setup()

      enterText(input)
      await submit()

      await screen.findByText('Please correct the highlighted lines')
      expect(
        screen.getByRole('button', { name: 'Add SOR codes' })
      ).toBeEnabled()
      expect(screen.queryByTestId('spinner-undefined')).toBeNull()
    })

    it('drops an error when its line is edited, but keeps the others', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()
      await screen.findByText('Please correct the highlighted lines')

      enterText('00000001\n\n00000003 2\n00000002\n88888888')

      expect(errorItems()).toEqual(['Line 5: 88888888 SOR code does not exist'])
      expect(callbacks.sorExistenceValidationCallback).toHaveBeenCalledTimes(1)
    })

    it('keeps the error when another line is edited', async () => {
      setup()

      enterText(input)
      await submit()
      await screen.findByText('Please correct the highlighted lines')

      enterText('00000001 5\n\n99999999 2\n00000002\n88888888')

      expect(errorItems()).toEqual([
        'Line 3: 99999999 2 SOR code does not exist',
        'Line 5: 88888888 SOR code does not exist',
      ])
    })

    it('uploads once the missing codes are fixed and resubmitted', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()
      await screen.findByText('Please correct the highlighted lines')

      enterText('00000001\n00000003 2\n00000002')
      await submit()

      await waitForUpload(callbacks)
      expect(callbacks.sorExistenceValidationCallback).toHaveBeenCalledTimes(2)
      expect(callbacks.setSorCodesFromBatchUpload).toHaveBeenCalledWith([
        { ...sor('00000001'), quantity: '1' },
        { ...sor('00000003'), quantity: '2' },
        { ...sor('00000002'), quantity: '1' },
      ])
    })

    it('forgets the old existence errors if the next submit fails the local checks', async () => {
      const callbacks = setup()

      enterText(input)
      await submit()
      await screen.findByText('Please correct the highlighted lines')

      enterText('00000001\n\n99999999 2\n0000000')
      await submit()

      await screen.findByText(/Invalid SOR code format/)
      expect(errorItems()).toEqual(['Line 4: 0000000 Invalid SOR code format'])
      expect(callbacks.sorExistenceValidationCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the existence check fails outright', () => {
    it('shows an error, adds nothing and lets the user try again', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      const callbacks = setup({
        sorExistenceValidationCallback: jest
          .fn()
          .mockRejectedValueOnce(new Error('Network Error'))
          .mockImplementation(defaultExistenceValidation),
      })

      enterText('00000001')
      await submit()

      expect(
        await screen.findByText(
          'Unable to check the SOR codes, please try again'
        )
      ).toBeInTheDocument()
      expect(callbacks.setSorCodesFromBatchUpload).not.toHaveBeenCalled()
      expect(callbacks.setPageBackToFormView).not.toHaveBeenCalled()
      expect(
        screen.getByRole('button', { name: 'Add SOR codes' })
      ).toBeEnabled()
      expect(screen.queryByTestId('spinner-undefined')).toBeNull()
      expect(getEditor()).toHaveFocus()

      await submit()

      await waitForUpload(callbacks)
      expect(
        screen.queryByText('Unable to check the SOR codes, please try again')
      ).toBeNull()
    })
  })
})

import { render, fireEvent, within } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { RaiseWorkOrderReasonForRepair } from '.'

const FIRST = 'reasonForRepair'
const SECOND = 'additionalReasonForRepair1'
const THIRD = 'additionalReasonForRepair2'
const FOURTH = 'additionalReasonForRepair3'

const ALL_REASONS = [
  'damp-and-mould',
  'excess-cold',
  'excess-heat',
  'falls-on-the-level',
  'falling-on-stairs',
  'falling-between-levels',
  'structural-collapse-and-falling-elements',
  'fire-and-explosions',
  'electrical-hazards',
  'domestic-hygiene',
]

const TestForm = ({ formState }) => {
  const { register, errors } = useForm({ defaultValues: { ...formState } })

  return (
    <RaiseWorkOrderReasonForRepair
      register={register}
      errors={errors}
      formState={formState}
    />
  )
}

describe('RaiseWorkOrderReasonForRepair', () => {
  const renderForm = (formState) => render(<TestForm formState={formState} />)

  const select = (name) => document.querySelector(`[data-testid="${name}"]`)
  const selectValue = (name) => select(name).value
  const optionValues = (name) =>
    within(select(name))
      .getAllByRole('option')
      .map((option) => option.value)
      .filter(Boolean)
  const selectedNames = () =>
    [...document.querySelectorAll('select')].map((el) => el.name)

  const addAnotherLink = () =>
    document.querySelector('[data-testid="add-another-reason-for-repair-link"]')
  const removeLink = (name) =>
    document.querySelector(`[data-testid="remove-${name}-link"]`)

  const choose = (name, value) =>
    fireEvent.change(select(name), { target: { value } })
  const addAnother = () => fireEvent.click(addAnotherLink())
  const remove = (name) => fireEvent.click(removeLink(name))

  it('should render properly', () => {
    const { asFragment } = renderForm()

    expect(asFragment()).toMatchSnapshot()
  })

  describe('by default', () => {
    it('shows a single empty dropdown and nothing else', () => {
      renderForm()

      expect(selectedNames()).toEqual([FIRST])
      expect(selectValue(FIRST)).toBe('')
      expect(addAnotherLink()).toBeNull()
      expect(removeLink(SECOND)).toBeNull()
    })

    it('offers every reason plus none of the above', () => {
      renderForm()

      expect(optionValues(FIRST)).toEqual([...ALL_REASONS, 'none-of-the-above'])
    })
  })

  describe('when none of the above is selected', () => {
    it('selects it and offers no way to add more', () => {
      renderForm()

      choose(FIRST, 'none-of-the-above')

      expect(selectValue(FIRST)).toBe('none-of-the-above')
      expect(selectedNames()).toEqual([FIRST])
      expect(addAnotherLink()).toBeNull()
    })

    it('removes any additional reasons already added', () => {
      // IE - the first option is changed back to none-of-the-above
      renderForm()

      choose(FIRST, 'excess-cold')
      addAnother()
      choose(SECOND, 'excess-heat')
      expect(selectedNames()).toEqual([FIRST, SECOND])

      choose(FIRST, 'none-of-the-above')

      expect(selectedNames()).toEqual([FIRST])
      expect(addAnotherLink()).toBeNull()
    })
  })

  describe('when another reason is selected', () => {
    it('shows the add another button', () => {
      renderForm()

      choose(FIRST, 'damp-and-mould')

      expect(addAnotherLink()).toBeInTheDocument()
    })

    it('adds a dropdown without the selected reason or none of the above', () => {
      renderForm()

      choose(FIRST, 'damp-and-mould')
      addAnother()

      expect(selectedNames()).toEqual([FIRST, SECOND])
      expect(selectValue(SECOND)).toBe('')
      expect(optionValues(SECOND)).toEqual(
        ALL_REASONS.filter((reason) => reason !== 'damp-and-mould')
      )
      expect(removeLink(FIRST)).toBeNull()
      expect(removeLink(SECOND)).toBeInTheDocument()
    })

    it('hides the add another button until the new dropdown has a value', () => {
      renderForm()

      choose(FIRST, 'damp-and-mould')
      addAnother()
      expect(addAnotherLink()).toBeNull()

      choose(SECOND, 'excess-cold')
      expect(addAnotherLink()).toBeInTheDocument()
    })

    it('keeps the earlier selections when a later one is made', () => {
      renderForm()

      choose(FIRST, 'excess-cold')
      addAnother()
      choose(SECOND, 'excess-heat')
      addAnother()
      choose(THIRD, 'falls-on-the-level')

      expect(selectValue(FIRST)).toBe('excess-cold')
      expect(selectValue(SECOND)).toBe('excess-heat')
      expect(selectValue(THIRD)).toBe('falls-on-the-level')
    })
  })

  describe('with four reasons added', () => {
    const addFourReasons = () => {
      choose(FIRST, 'excess-cold')
      addAnother()
      choose(SECOND, 'excess-heat')
      addAnother()
      choose(THIRD, 'falls-on-the-level')
      addAnother()
      choose(FOURTH, 'falling-on-stairs')
    }

    it('keeps the remaining selections when removing the second, then the last, then the third', () => {
      renderForm()
      addFourReasons()
      expect(selectedNames()).toEqual([FIRST, SECOND, THIRD, FOURTH])

      // second
      remove(SECOND)
      expect(selectedNames()).toEqual([FIRST, THIRD, FOURTH])
      expect(selectValue(FIRST)).toBe('excess-cold')
      expect(selectValue(THIRD)).toBe('falls-on-the-level')
      expect(selectValue(FOURTH)).toBe('falling-on-stairs')

      // last
      remove(FOURTH)
      expect(selectedNames()).toEqual([FIRST, THIRD])
      expect(selectValue(FIRST)).toBe('excess-cold')
      expect(selectValue(THIRD)).toBe('falls-on-the-level')
      expect(addAnotherLink()).toBeInTheDocument()

      // final additional row
      remove(THIRD)
      expect(selectedNames()).toEqual([FIRST])
      expect(selectValue(FIRST)).toBe('excess-cold')
      expect(removeLink(THIRD)).toBeNull()
      expect(addAnotherLink()).toBeInTheDocument()
    })

    it('adds new rows with fresh names after removals', () => {
      renderForm()
      addFourReasons()

      remove(SECOND)
      addAnother()

      expect(selectedNames()).toEqual([
        FIRST,
        THIRD,
        FOURTH,
        'additionalReasonForRepair4',
      ])
      expect(selectValue('additionalReasonForRepair4')).toBe('')
    })
  })

  describe('edge cases', () => {
    it('lets a removed reason be chosen again by another row', () => {
      renderForm()

      choose(FIRST, 'excess-cold')
      addAnother()
      choose(SECOND, 'excess-heat')
      addAnother()

      expect(optionValues(THIRD)).not.toContain('excess-heat')

      remove(SECOND)

      expect(optionValues(THIRD)).toContain('excess-heat')
    })

    it('stops offering a reason once another row has picked it', () => {
      renderForm()

      choose(FIRST, 'excess-cold')
      addAnother()
      choose(SECOND, 'excess-heat')

      expect(optionValues(FIRST)).not.toContain('excess-heat')
      expect(optionValues(SECOND)).not.toContain('excess-cold')
    })

    it('hides the add another button when every reason is used', () => {
      renderForm()

      choose(FIRST, ALL_REASONS[0])
      ALL_REASONS.slice(1).forEach((reason, i) => {
        addAnother()
        choose(`additionalReasonForRepair${i + 1}`, reason)
      })

      expect(selectedNames()).toHaveLength(ALL_REASONS.length)
      expect(addAnotherLink()).toBeNull()
    })

    it('restores rows from a previous form state, including gaps in numbering', () => {
      renderForm({
        reasonForRepair: 'excess-cold',
        additionalReasonForRepair1: 'excess-heat',
        additionalReasonForRepair3: 'fire-and-explosions',
      })

      expect(selectedNames()).toEqual([FIRST, SECOND, FOURTH])
      expect(selectValue(FIRST)).toBe('excess-cold')
      expect(selectValue(SECOND)).toBe('excess-heat')
      expect(selectValue(FOURTH)).toBe('fire-and-explosions')
    })

    it('does not reuse an id when adding after restoring', () => {
      renderForm({
        reasonForRepair: 'excess-cold',
        additionalReasonForRepair3: 'fire-and-explosions',
      })

      addAnother()

      expect(selectedNames()).toEqual([
        FIRST,
        FOURTH,
        'additionalReasonForRepair4',
      ])
    })
  })
})

import { render } from '@testing-library/react'
import { addDays } from 'date-fns'
import DatePicker from '../Form/DatePicker/DatePicker'

describe('DatePicker component', () => {
  
    const props = {
        name: "date",
        label: "Select completion date",
        hint: "For example, 15/05/2021",
        requ: "Please pick completion date",
        validate: {
            isInThePast: value => isPast(new Date(value)) || 'Please select a date that is in the past',
            isLaterThanRaisedDate: value => new Date(value) > new Date(new Date(dateRaised).toDateString()) || `Completion date must be on or after ${new Date(dateRaised).toLocaleDateString()}`,
        }
    }

    it('should validate a completed date before the raised date as invalid', () => {
        const { asFragment } = render(
          <DatePicker
            name={props.name}
            label={props.label}
            hint={props.hint}
            register={register({
                required: props.requ,
                validate: props.validate
            })}
            error={errors && errors.date}
            defaultValue={date ? date.toISOString().split('T')[0] : null}
          />
        )
        expect(asFragment()).toMatchSnapshot()
    })
})
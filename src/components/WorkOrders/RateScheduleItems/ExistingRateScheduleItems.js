import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { TextInput } from '../../Form'

const ExistingRateScheduleItems = ({ tasks, errors, register }) => {
  return (
    <>
      <GridRow className="rate-schedule-items align-items-center">
        {tasks.map((t, index) => (
          <div key={index}>
            <GridColumn width="two-thirds">
              <TextInput
                name={`sor-code-${index}`}
                label={index == 0 ? 'SOR code' : ''}
                widthClass={`sor-code-${index} govuk-!-width-full`}
                register={register}
                disabled="disabled"
                value={`${[t.code, t.description].filter(Boolean).join(' - ')}`}
              />
              <input
                id={`original-rate-schedule-item-${index}`}
                name={`original-rate-schedule-item-${index}`}
                type="hidden"
                value={t.id}
                ref={register}
              />
            </GridColumn>
            <GridColumn width="one-third">
              <TextInput
                name={`quantity-${index}`}
                label={index == 0 ? 'Quantity' : ''}
                error={errors && errors.quantity}
                widthClass={`quantity-${index} govuk-!-width-full`}
                defaultValue={t.quantity}
                register={register({
                  required: 'Please enter a quantity',
                  valueAsNumber: true,
                  validate: (value) => {
                    if (!Number.isInteger(value)) {
                      return 'Quantity must be a whole number'
                    } else if (value > 50) {
                      return 'Quantity must be 50 or less'
                    } else {
                      return true
                    }
                  },
                })}
              />
            </GridColumn>
          </div>
        ))}
      </GridRow>
    </>
  )
}

ExistingRateScheduleItems.propTypes = {
  tasks: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
}

export default ExistingRateScheduleItems

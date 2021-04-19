import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { TextInput } from '../../Form'

const LatestRateScheduleItems = ({ latestTasks, errors, register }) => {
  return (
    <div>
      <section className="section" id="existing-rate-schedule-items">
        <h2 className="lbh-heading-h2">
          Latest tasks and SORS against the work order
        </h2>

        <GridRow className="rate-schedule-items align-items-center">
          {latestTasks.map((t, index) => (
            <div key={index}>
              <GridColumn width="two-thirds">
                <TextInput
                  name={`sor-code-${index}`}
                  label={index == 0 ? 'SOR code' : ''}
                  widthClass={`sor-code-${index} govuk-!-width-full`}
                  register={register}
                  disabled="disabled"
                  value={`${[t.code, t.description]
                    .filter(Boolean)
                    .join(' - ')}`}
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
                  error={errors && errors?.[`quantity-${index}`]}
                  widthClass={`quantity-${index} govuk-!-width-full`}
                  defaultValue={t.quantity}
                  register={register({
                    required: 'Please enter a quantity',
                    validate: (value) => {
                      const valueAsNumber = parseFloat(value)
                      if (!Number.isInteger(valueAsNumber)) {
                        return 'Quantity must be a whole number'
                      }
                    },
                  })}
                />
              </GridColumn>
            </div>
          ))}
        </GridRow>

        <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
      </section>
    </div>
  )
}

LatestRateScheduleItems.propTypes = {
  latestTasks: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
}

export default LatestRateScheduleItems

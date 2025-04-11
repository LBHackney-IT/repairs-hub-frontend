import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { TextInput } from '../../Form'

const OriginalRateScheduleItems = ({ originalTasks }) => {
  return (
    <div>
      <section
        className="section"
        id="original-rate-schedule-items"
      >
        <h2 className="lbh-heading-h2">
          Original tasks and SORS raised with work order
        </h2>

        <GridRow className="original-rate-schedule-items align-items-center">
          {originalTasks.map((task, index) => (
            <div key={index}>
              <GridColumn width="two-thirds">
                <TextInput
                  name={`originalRateScheduleItems[${index}][code]`}
                  label={index == 0 ? 'SOR code' : ''}
                  disabled={true}
                  value={`${[task.code, task.description]
                    .filter(Boolean)
                    .join(' - ')}`}
                />
              </GridColumn>
              <GridColumn width="one-third">
                <TextInput
                  name={`originalRateScheduleItems[${index}][quantity]`}
                  label={index == 0 ? 'Quantity' : ''}
                  disabled={true}
                  value={task.originalQuantity}
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

OriginalRateScheduleItems.propTypes = {
  originalTasks: PropTypes.array.isRequired,
}

export default OriginalRateScheduleItems

import PropTypes from 'prop-types'
import Spinner from '../../Spinner/Spinner'
import { Checkbox, PrimarySubmitButton } from '../../Form'

const WorkOrdersFilter = ({ loading, filters, register, appliedFilters }) => (
  <details className="govuk-details" data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span className="govuk-details__summary-text">Filters</span>
    </summary>

    {loading ? (
      <Spinner />
    ) : (
      <>
        {filters && (
          <>
            <div className="govuk-form-group lbh-form-group">
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                  Status
                </legend>

                <div className="govuk-checkboxes">
                  {filters.Status.map((status, index) => (
                    <Checkbox
                      key={index}
                      name={`StatusCode.${status.key}`}
                      label={status.description}
                      register={register}
                      checked={appliedFilters?.StatusCode?.includes(status.key)}
                    />
                  ))}
                </div>
              </fieldset>
            </div>

            <PrimarySubmitButton label="Apply filters" />
          </>
        )}
      </>
    )}
  </details>
)

WorkOrdersFilter.propTypes = {
  loading: PropTypes.bool.isRequired,
  filters: PropTypes.object,
  appliedFilters: PropTypes.object,
  register: PropTypes.func.isRequired,
}

export default WorkOrdersFilter

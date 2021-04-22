import PropTypes from 'prop-types'
import Spinner from '../../Spinner/Spinner'
import { Checkbox, Button } from '../../Form'
import { GridColumn, GridRow } from '../../Layout/Grid'

const WorkOrdersFilter = ({
  loading,
  filters,
  register,
  appliedFilters,
  clearFilters,
}) => {
  return (
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
              <GridRow>
                <div className="govuk-form-group lbh-form-group">
                  <GridColumn width="one-half">
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
                            checked={appliedFilters?.StatusCode?.includes(
                              status.key
                            )}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </GridColumn>

                  <GridColumn width="one-half">
                    <fieldset className="govuk-fieldset">
                      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        Priority
                      </legend>

                      <div className="govuk-checkboxes">
                        {filters.Priority.map((priority, index) => (
                          <Checkbox
                            key={index}
                            name={`Priorities.${priority.key}`}
                            label={priority.description}
                            register={register}
                            checked={appliedFilters?.Priorities?.includes(
                              priority.key
                            )}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </GridColumn>
                </div>
              </GridRow>
              <div>
                <Button label="Apply filters" type="submit" />
                <div>
                  <a href="#" onClick={(e) => clearFilters(e)}>
                    Clear filters
                  </a>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </details>
  )
}

WorkOrdersFilter.propTypes = {
  loading: PropTypes.bool.isRequired,
  filters: PropTypes.object,
  appliedFilters: PropTypes.object,
  register: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
}

export default WorkOrdersFilter

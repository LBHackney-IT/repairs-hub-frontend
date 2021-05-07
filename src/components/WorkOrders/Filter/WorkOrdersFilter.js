import { useContext } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../../Spinner/Spinner'
import { Checkbox, Button } from '../../Form'
import UserContext from '../../UserContext/UserContext'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '../../../utils/status-codes'
import Collapsible from '../../Layout/Collapsible/Collapsible'

const WorkOrdersFilter = ({
  loading,
  filters,
  register,
  appliedFilters,
  clearFilters,
}) => {
  const { user } = useContext(UserContext)

  const CHECKBOX_NUMBER = 5

  const statusFilterOptions = () => {
    if (user && user.hasContractorPermissions) {
      return filters.Status.filter(
        (status) =>
          status.key !== STATUS_AUTHORISATION_PENDING_APPROVAL.code.toString()
      )
    } else {
      return filters.Status
    }
  }

  const showAllCheckboxes = (e, filterType) => {
    e.preventDefault()

    const checkboxes = document.getElementById(filterType)

    checkboxes.childNodes.forEach((checkbox) => {
      if (checkbox.classList.contains('govuk-!-display-none')) {
        checkbox.classList.remove('govuk-!-display-none')
      }
    })

    document.querySelector(`.${filterType}`).remove()
  }

  const showAllCheckboxesHtml = (numberOfFilterOptions, filterType) => {
    if (numberOfFilterOptions > CHECKBOX_NUMBER) {
      return (
        <div
          className={`govuk-!-padding-left-2 govuk-!-padding-bottom-2 govuk-!-margin-1 ${filterType}`}
        >
          <a
            href="#"
            onClick={(e) => showAllCheckboxes(e, filterType)}
            className="govuk-link"
          >
            Show all {numberOfFilterOptions}
          </a>
        </div>
      )
    }
  }

  const filterOptionsHtml = () => {
    return (
      <div className="govuk-form-group lbh-form-group filter-options govuk-!-margin-bottom-5">
        <div className="govuk-!-padding-left-2">
          <Button label="Apply filters" type="submit" />
          <div>
            <a className="govuk-link" href="#" onClick={(e) => clearFilters(e)}>
              Clear filters
            </a>
          </div>
        </div>

        {user &&
          (user.hasContractManagerPermissions ||
            user.hasAuthorisationManagerPermissions) && (
            <div className="border-bottom-grey">
              <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-padding-top-3">
                  Contractor
                </legend>

                <div
                  className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1"
                  id="contractor-filters"
                >
                  {filters.Contractors.map((contractor, index) => (
                    <Checkbox
                      className="govuk-!-margin-0"
                      key={index}
                      name={`ContractorReference.${contractor.key}`}
                      label={contractor.description}
                      register={register}
                      checked={appliedFilters?.ContractorReference?.includes(
                        contractor.key
                      )}
                      hidden={index >= CHECKBOX_NUMBER}
                    />
                  ))}
                </div>
              </fieldset>

              {showAllCheckboxesHtml(
                filters.Contractors.length,
                'contractor-filters'
              )}
            </div>
          )}

        <div className="border-bottom-grey">
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              Status
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1"
              id="status-filters"
            >
              {statusFilterOptions().map((status, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  key={index}
                  name={`StatusCode.${status.key}`}
                  label={status.description}
                  register={register}
                  checked={appliedFilters?.StatusCode?.includes(status.key)}
                  hidden={index >= CHECKBOX_NUMBER}
                />
              ))}
            </div>
          </fieldset>

          {showAllCheckboxesHtml(
            statusFilterOptions().length,
            'status-filters'
          )}
        </div>

        <div className="border-bottom-grey">
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              Priority
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1"
              id="priority-filters"
            >
              {filters.Priority.map((priority, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  key={index}
                  name={`Priorities.${priority.key}`}
                  label={priority.description}
                  register={register}
                  checked={appliedFilters?.Priorities?.includes(priority.key)}
                  hidden={index >= CHECKBOX_NUMBER}
                />
              ))}
            </div>
          </fieldset>

          {showAllCheckboxesHtml(filters.Priority.length, 'priority-filters')}
        </div>

        <div className="border-bottom-grey">
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              Trade
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1"
              id="trade-filters"
            >
              {filters.Trades.map((trade, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  key={index}
                  name={`TradeCodes.${trade.key}`}
                  label={trade.description}
                  register={register}
                  checked={appliedFilters?.Trades?.includes(trade.key)}
                  hidden={index >= CHECKBOX_NUMBER}
                />
              ))}
            </div>
          </fieldset>

          {showAllCheckboxesHtml(filters.Trades.length, 'trade-filters')}
        </div>
      </div>
    )
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {filters && (
            <Collapsible
              heading="Filters"
              collapsableDivClassName="filter-collapsible"
              contentMargin="govuk-!-margin-0"
              children={filterOptionsHtml()}
            />
          )}
        </>
      )}
    </>
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

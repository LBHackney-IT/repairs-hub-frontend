import { useContext } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../../Spinner'
import { Checkbox, Button } from '../../Form'
import UserContext from '../../UserContext'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '@/utils/statusCodes'
import Collapsible from '../../Layout/Collapsible'
import FilterTag from '../../Tag/FilterTag'
import { canSeeAllFilters } from '@/utils/userPermissions'

const WorkOrdersFilter = ({
  loading,
  filters,
  register,
  appliedFilters,
  clearFilters,
  selectedFilters,
}) => {
  const { user } = useContext(UserContext)

  const CHECKBOX_NUMBER = 5

  const saveAppliedFiltersToLocalStorage = (e) => {
    e.preventDefault()

    if (
      window.confirm(
        `Save my selected filters:\n${JSON.stringify(selectedFilters).replace(
          /["{}:]/g,
          ' '
        )} as the default preset?`
      )
    ) {
      localStorage.setItem(
        'RH - default work order filters',
        JSON.stringify(appliedFilters)
      )
    }
  }

  const removeAppliedFiltersFromLocalStorage = (e) => {
    e.preventDefault()

    if (window.confirm('Remove my default saved filters?')) {
      localStorage.removeItem('RH - default work order filters')
    }
  }

  const statusFilterOptions = () => {
    if (user && canSeeAllFilters(user)) {
      return filters.Status
    } else {
      return filters.Status.filter(
        (status) =>
          status.key !== STATUS_AUTHORISATION_PENDING_APPROVAL.code.toString()
      )
    }
  }

  const showContractorFilters = () => {
    return filters.Contractors.length > 1
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
            className="lbh-link"
          >
            Show all {numberOfFilterOptions}
          </a>
        </div>
      )
    }
  }

  const selectedFilterOptions = () => {
    if (Object.keys(selectedFilters).length === 0) {
      return <p className="lbh-body-s">You have no selected filters</p>
    }

    return Object.keys(selectedFilters).map((filterCategory) => {
      return (
        <div key={filterCategory}>
          <h4 className="lbh-heading-h4">{filterCategory}</h4>
          <ul className="filter-tags" id={`selected-filters-${filterCategory}`}>
            {selectedFilters[filterCategory].map((option, i) => {
              return <FilterTag text={option} key={i} />
            })}
          </ul>
        </div>
      )
    })
  }

  const selectedFilterOptionsHtml = () => {
    return (
      <div className="selected-filters govuk-!-padding-bottom-2">
        <div className="govuk-!-padding-2">
          <div>
            <a
              className="lbh-link lbh-body-xs"
              href="#"
              onClick={(e) => clearFilters(e)}
            >
              Clear filters
            </a>
          </div>
          <div>
            <a
              className="lbh-link lbh-body-xs"
              href="#"
              onClick={(e) => saveAppliedFiltersToLocalStorage(e)}
            >
              Save selected filters as my default preset
            </a>
          </div>
          <div>
            <a
              className="lbh-link lbh-body-xs"
              href="#"
              onClick={(e) => removeAppliedFiltersFromLocalStorage(e)}
            >
              Remove saved default filter preset
            </a>
          </div>

          {selectedFilterOptions()}
        </div>
      </div>
    )
  }

  const filterOptionsHtml = () => {
    return (
      <div className="govuk-form-group lbh-form-group filter-options govuk-!-margin-bottom-5">
        <Collapsible
          heading="Selected filters"
          collapsableDivClassName="filter-collapsible"
          contentMargin="govuk-!-margin-0"
          children={selectedFilterOptionsHtml()}
        />

        <div className="govuk-!-padding-left-2 govuk-!-margin-top-0">
          <Button label="Apply filters" type="submit" />
        </div>

        {showContractorFilters() && (
          <div className="border-bottom-grey">
            <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-padding-top-3">
                Contractor
              </legend>

              <div
                className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
                id="contractor-filters"
              >
                {filters.Contractors.map((contractor, index) => (
                  <Checkbox
                    className="govuk-!-margin-0"
                    labelClassName="lbh-body-xs"
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
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Status
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
              id="status-filters"
            >
              {statusFilterOptions().map((status, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  labelClassName="lbh-body-xs"
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
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Priority
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
              id="priority-filters"
            >
              {filters.Priority.map((priority, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  labelClassName="lbh-body-xs"
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
          <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Trade
            </legend>

            <div
              className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
              id="trade-filters"
            >
              {filters.Trades.map((trade, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  labelClassName="lbh-body-xs"
                  key={index}
                  name={`TradeCodes.${trade.key}`}
                  label={trade.description}
                  register={register}
                  checked={appliedFilters?.TradeCodes?.includes(trade.key)}
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

import { MouseEvent, useContext } from 'react'
import { UseFormRegister } from 'react-hook-form'
import Spinner from '../../Spinner'
import { Checkbox, Button } from '../../Form'
import UserContext from '../../UserContext'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '@/utils/statusCodes'
import Collapsible from '../../Layout/Collapsible'
import FilterTag from '../../Tag/FilterTag'
import { canSeeAllFilters } from '@/utils/userPermissions'
import { convertToSentenceCases } from '@/utils/helpers/textConverter'
import type {
  FilterOption,
  FilterOptionsByCategory,
} from '@/utils/helpers/filter'

interface Props {
  loading: boolean
  filters?: FilterOptionsByCategory
  register: UseFormRegister<any>
  appliedFilters: Record<string, any>
  clearFilters: (e: MouseEvent<HTMLElement>) => void
  selectedFilters?: Record<string, string[]>
  onFilterRemove: (category: string, index: number) => void
}

interface FilterGroupOptions {
  legend: string
  legendClassName?: string
  id: string
  options?: FilterOption[]
  name: string
  getLabel: (option: FilterOption) => string
}

const WorkOrdersFilter = ({
  loading,
  filters,
  register,
  appliedFilters,
  clearFilters,
  selectedFilters,
  onFilterRemove,
}: Props) => {
  const { user } = useContext(UserContext)

  const CHECKBOX_NUMBER = 5

  const saveAppliedFiltersToLocalStorage = (e: MouseEvent<HTMLElement>) => {
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

  const removeAppliedFiltersFromLocalStorage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (window.confirm('Remove my default saved filters?')) {
      localStorage.removeItem('RH - default work order filters')
    }
  }

  const statusFilterOptions = () => {
    if (!filters) return undefined

    if (user && canSeeAllFilters(user)) {
      return filters.Status
    } else {
      return filters.Status.filter(
        (status) =>
          status.key !== STATUS_AUTHORISATION_PENDING_APPROVAL.code.toString()
      )
    }
  }

  // Contractor options aren't known until loaded, so show the box meanwhile
  const showContractorFilters = () => {
    return loading || filters?.Contractors.length > 1
  }

  const showAllCheckboxes = (
    e: MouseEvent<HTMLElement>,
    filterType: string
  ) => {
    e.preventDefault()

    const checkboxes = document.getElementById(filterType)

    checkboxes.childNodes.forEach((node) => {
      const checkbox = node as HTMLElement

      if (checkbox.classList.contains('govuk-!-display-none')) {
        checkbox.classList.remove('govuk-!-display-none')
      }
    })

    document.querySelector(`.${filterType}`).remove()
  }

  const showAllCheckboxesHtml = (
    numberOfFilterOptions: number,
    filterType: string
  ) => {
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
    if (loading || !selectedFilters) {
      return <Spinner resource="selected-filters" width={30} />
    }

    if (Object.keys(selectedFilters).length === 0) {
      return <p className="lbh-body-s">You have no selected filters</p>
    }

    return Object.keys(selectedFilters).map((filterCategory) => {
      return (
        <div key={filterCategory}>
          <h4 className="lbh-heading-h4">{filterCategory}</h4>
          <ul className="filter-tags" id={`selected-filters-${filterCategory}`}>
            {selectedFilters[filterCategory].map((option, i) => {
              return (
                <FilterTag
                  text={option}
                  key={i}
                  index={i}
                  category={filterCategory}
                  onFilterRemove={onFilterRemove}
                />
              )
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

  // Invisible rows take up the space of the default visible options, so the
  // layout doesn't shift when the real options load
  const loadingPlaceholder = (id: string) => (
    <div className="filter-loading-placeholder">
      {Array.from({ length: CHECKBOX_NUMBER }, (_, index) => (
        <div
          key={index}
          className="govuk-checkboxes__item govuk-!-margin-0"
          aria-hidden="true"
        >
          <label className="govuk-label govuk-checkboxes__label lbh-body-xs">
            &nbsp;
          </label>
        </div>
      ))}
      <div className="filter-loading-spinner">
        <Spinner resource={id} width={30} />
      </div>
    </div>
  )

  // A fieldset of checkboxes, showing a spinner in place of the options until loaded
  const filterGroup = ({
    legend,
    legendClassName = '',
    id,
    options,
    name,
    getLabel,
  }: FilterGroupOptions) => (
    <div className="border-bottom-grey">
      <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
        <legend
          className={`govuk-fieldset__legend govuk-fieldset__legend--s ${legendClassName}`.trim()}
        >
          {legend}
        </legend>

        <div
          className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
          id={id}
        >
          {loading || !options
            ? loadingPlaceholder(id)
            : options.map((option, index) => (
                <Checkbox
                  className="govuk-!-margin-0"
                  labelClassName="lbh-body-xs"
                  key={index}
                  name={`${name}.${option.key}`}
                  label={getLabel(option)}
                  register={register}
                  checked={appliedFilters?.[name]?.includes(option.key)}
                  hidden={index >= CHECKBOX_NUMBER}
                />
              ))}
        </div>
      </fieldset>

      {!loading && options && showAllCheckboxesHtml(options.length, id)}
    </div>
  )

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
          <Button
            label="Apply filters"
            type="submit"
            data-testid="apply-filters"
          />
        </div>

        {showContractorFilters() &&
          filterGroup({
            legend: 'Contractor',
            legendClassName: 'govuk-!-padding-top-3',
            id: 'contractor-filters',
            options: filters?.Contractors,
            name: 'ContractorReference',
            getLabel: (contractor) => contractor.description,
          })}

        {filterGroup({
          legend: 'Status',
          id: 'status-filters',
          options: statusFilterOptions(),
          name: 'StatusCode',
          getLabel: (status) => convertToSentenceCases(status.description),
        })}

        {filterGroup({
          legend: 'Priority',
          id: 'priority-filters',
          options: filters?.Priority,
          name: 'Priorities',
          getLabel: (priority) => priority.description,
        })}

        {filterGroup({
          legend: 'Trade',
          id: 'trade-filters',
          options: filters?.Trades,
          name: 'TradeCodes',
          getLabel: (trade) => trade.description,
        })}
      </div>
    )
  }

  // Without filters and not loading, the request failed and the parent shows the error
  if (!loading && !filters) return null

  return (
    <Collapsible
      heading="Filters"
      collapsableDivClassName="filter-collapsible"
      contentMargin="govuk-!-margin-0"
      children={filterOptionsHtml()}
    />
  )
}

export default WorkOrdersFilter

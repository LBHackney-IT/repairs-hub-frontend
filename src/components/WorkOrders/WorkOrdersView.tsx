import { useState, useEffect } from 'react'
import WorkOrdersTable from './WorkOrdersTable'
import Spinner from '../Spinner'
import SpinnerWithLabel from '../SpinnerWithLabel'
import ErrorMessage from '../Errors/ErrorMessage'
import WorkOrdersFilterView from './Filter/WorkOrdersFilterView'
import { GridColumn, GridRow } from '../Layout/Grid'
import Meta from '../Meta'
import { useWorkOrdersView } from '@/hooks/useWorkOrdersView'
import { WORK_ORDERS_MANAGEMENT_PAGE_SIZE } from '@/utils/helpers/workOrdersFilters'
import type { PageProps } from '@/types/page'

const WorkOrdersViewContent = ({ query }: PageProps) => {
  const {
    workOrders,
    loading,
    error,
    pageNumber,
    appliedFilters,
    onFilterSubmit,
    clearFilters,
    onFilterRemove,
    handlePageClick,
  } = useWorkOrdersView(query)

  return (
    <>
      <Meta title="Manage work orders" />
      <GridRow className="manage-work-orders">
        <GridColumn
          width="one-quarter"
          className="filter-container govuk-!-padding-0"
        >
          <WorkOrdersFilterView
            onFilterSubmit={onFilterSubmit}
            appliedFilters={appliedFilters}
            clearFilters={clearFilters}
            onFilterRemove={onFilterRemove}
          />
        </GridColumn>

        <GridColumn width="three-quarters">
          <h1 className="lbh-heading-h1">Manage work orders</h1>
          {loading ? (
            <div className="govuk-!-margin-top-6">
              <SpinnerWithLabel label="Fetching work orders" />
            </div>
          ) : (
            <>
              {workOrders && (
                <WorkOrdersTable
                  workOrders={workOrders}
                  pageNumber={pageNumber}
                  handlePageClick={handlePageClick}
                  pageSize={WORK_ORDERS_MANAGEMENT_PAGE_SIZE}
                />
              )}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </GridColumn>
      </GridRow>
    </>
  )
}

// Local storage is only available in the browser, so wait until mounted
const WorkOrdersView = (props: PageProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <WorkOrdersViewContent {...props} /> : <Spinner />
}

export default WorkOrdersView

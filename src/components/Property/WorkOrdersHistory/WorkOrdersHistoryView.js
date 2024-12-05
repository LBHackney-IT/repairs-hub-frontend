import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import WorkOrdersHistoryTable from './WorkOrdersHistoryTable'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

const WORK_ORDERS_HISTORY_PAGE_SIZE = 50

const WorkOrdersHistoryView = ({ propertyReference, tabName }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getWorkOrdersHistoryView = async (propertyReference, pageNumber) => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        path: '/api/workOrders/',
        method: 'get',
        params: {
          propertyReference: propertyReference,
          PageSize: WORK_ORDERS_HISTORY_PAGE_SIZE,
          PageNumber: pageNumber,
          sort: 'dateraised:desc',
        },
      })

      setWorkOrders([...workOrders, ...data])
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrdersHistoryView(propertyReference, pageNumber)
  }, [])

  const loadMoreWorkOrders = (newPageNumber) => {
    setLoading(true)
    setPageNumber(pageNumber + 1)

    getWorkOrdersHistoryView(propertyReference, newPageNumber)
  }

  const renderWorkOrdersHistoryTable = () => {
    if (workOrders?.length > 0) {
      return (
        <>
          <WorkOrdersHistoryTable
            workOrders={workOrders}
            tabName={tabName}
            pageNumber={pageNumber}
            loadMoreWorkOrders={loadMoreWorkOrders}
            pageSize={WORK_ORDERS_HISTORY_PAGE_SIZE}
          />
        </>
      )
    }

    if (!error) {
      return (
        <>
          <h2 className="lbh-heading-h2">{tabName}</h2>
          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <h4 className="lbh-heading-h4">
              There are no historical repairs for this property.
            </h4>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {workOrders && renderWorkOrdersHistoryTable()}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

WorkOrdersHistoryView.propTypes = {
  tabName: PropTypes.string.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default WorkOrdersHistoryView

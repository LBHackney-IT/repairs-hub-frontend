import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RepairsHistoryTable from './RepairsHistoryTable'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getWorkOrdersForProperty } from '../../../utils/frontend-api-client/work-orders'
import { sortObjectsByDateKey } from '../../../utils/date'

const RepairsHistoryView = ({ propertyReference, tabName }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getWorkOrdersHistoryView = async (propertyReference, pageNumber) => {
    setError(null)

    try {
      const data = await getWorkOrdersForProperty(propertyReference, pageNumber)
      const workOrdersPerPage = sortObjectsByDateKey(
        data,
        ['dateRaised', 'lastUpdated'],
        'dateRaised'
      )
      setWorkOrders([...workOrders, ...workOrdersPerPage])
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
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

  const renderRepairsHistoryTable = () => {
    if (workOrders?.length > 0) {
      return (
        <RepairsHistoryTable
          workOrders={workOrders}
          tabName={tabName}
          pageNumber={pageNumber}
          loadMoreWorkOrders={loadMoreWorkOrders}
        />
      )
    }

    if (!error) {
      return (
        <>
          <h2 className="lbh-heading-l">{tabName}</h2>

          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <p className="lbh-heading-h4">There are no historical repairs</p>
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
          {workOrders && renderRepairsHistoryTable()}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

RepairsHistoryView.propTypes = {
  tabName: PropTypes.string.isRequired,
  propertyReference: PropTypes.string.isRequired,
}

export default RepairsHistoryView

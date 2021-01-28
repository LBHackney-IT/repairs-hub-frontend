import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RepairsHistoryTable from './RepairsHistoryTable'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getRepairs } from '../../../utils/frontend-api-client/repairs'
import { sortedByDate } from '../../../utils/date'

const RepairsHistoryView = ({ propertyReference }) => {
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getRepairsHistoryView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getRepairs(propertyReference)

      setWorkOrders(sortedByDate(data))
    } catch (e) {
      setWorkOrders(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getRepairsHistoryView(propertyReference)
  }, [])

  const renderRepairsHistoryTable = () => {
    if (workOrders?.length > 0) {
      return <RepairsHistoryTable workOrders={workOrders} />
    }

    if (!error) {
      return (
        <>
          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <p className="govuk-heading-s">There are no historical repairs</p>
          </div>
        </>
      )
    }
  }

  return (
    <div>
      <div className="govuk-tabs" data-module="tabs">
        <h2 className="govuk-tabs__title">Contents</h2>

        <ul className="govuk-tabs__list hackney-tabs-list">
          <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a className="govuk-tabs__tab" href="#repairs-history-tab">
              Repairs history
            </a>
          </li>
        </ul>

        <div
          className="govuk-tabs__panel hackney-tabs-panel"
          id="repairs-history-tab"
        >
          <h2 className="govuk-heading-l">Repairs history</h2>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {workOrders && renderRepairsHistoryTable()}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

RepairsHistoryView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default RepairsHistoryView

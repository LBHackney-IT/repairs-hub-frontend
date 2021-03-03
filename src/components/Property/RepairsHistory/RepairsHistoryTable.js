import { useContext } from 'react'
import PropTypes from 'prop-types'
import { PAGE_SIZE_AGENTS } from 'src/utils/frontend-api-client/repairs'
import UserContext from '../../UserContext/UserContext'
import RepairsHistoryRow from './RepairsHistoryRow'

const RepairsHistoryTable = ({
  workOrders,
  tabName,
  pageNumber,
  loadMoreWorkOrders,
}) => {
  const { user } = useContext(UserContext)

  const moreWorkOrdersAvailable = () => {
    // TODO: Replace with a real count from the API
    const maxWorkOrders = pageNumber * PAGE_SIZE_AGENTS

    return workOrders.length >= maxWorkOrders
  }

  const renderLoadMoreWorkOrders = () => {
    if (moreWorkOrdersAvailable()) {
      return (
        <div className="page-navigation govuk-!-padding-bottom-5">
          <button
            className="govuk-button left-page-button"
            data-module="govuk-button"
            onClick={() => loadMoreWorkOrders(pageNumber + 1)}
          >
            Load more
          </button>
        </div>
      )
    }
  }

  return (
    <>
      <h2 className="govuk-heading-l">{tabName}</h2>

      <table className="govuk-table govuk-!-margin-top-5 repairs-history-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row govuk-body">
            {user && user.hasAgentPermissions && (
              <th scope="col" className="govuk-table__header">
                Reference
              </th>
            )}
            <th scope="col" className="govuk-table__header">
              Date raised
            </th>
            <th scope="col" className="govuk-table__header">
              Trade
            </th>
            <th scope="col" className="govuk-table__header">
              Status
            </th>
            <th scope="col" className="govuk-table__header">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {workOrders.map((workOrder, index) => (
            <RepairsHistoryRow key={index} {...workOrder} />
          ))}
        </tbody>
      </table>
      {workOrders && renderLoadMoreWorkOrders()}
    </>
  )
}

RepairsHistoryTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.number,
      dateRaised: PropTypes.instanceOf(Date),
      tradeDescription: PropTypes.string,
      status: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  pageNumber: PropTypes.number,
  pageSizeAgents: PropTypes.number,
  loadMoreWorkOrders: PropTypes.func,
}

export default RepairsHistoryTable

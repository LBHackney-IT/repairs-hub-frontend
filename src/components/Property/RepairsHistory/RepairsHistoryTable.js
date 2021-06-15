import { useContext } from 'react'
import PropTypes from 'prop-types'
import { PAGE_SIZE_AGENTS } from 'src/utils/frontend-api-client/work-orders'
import UserContext from '../../UserContext/UserContext'
import RepairsHistoryRow from './RepairsHistoryRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'

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
      <h2 className="lbh-heading-h2">{tabName}</h2>

      <Table className="govuk-!-margin-top-5 repairs-history-table">
        <THead>
          <TR className="lbh-body">
            {user &&
              (user.hasAgentPermissions ||
                user.hasContractManagerPermissions ||
                user.hasAuthorisationManagerPermissions) && (
                <TH scope="col">Reference</TH>
              )}
            <TH scope="col">Date raised</TH>
            <TH scope="col">Trade</TH>
            <TH scope="col">Status</TH>
            <TH scope="col">Description</TH>
          </TR>
        </THead>
        <TBody>
          {workOrders.map((workOrder, index) => (
            <RepairsHistoryRow key={index} {...workOrder} />
          ))}
        </TBody>
      </Table>
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

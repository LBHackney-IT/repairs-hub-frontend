import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../../UserContext'
import WorkOrdersHistoryRow from './WorkOrdersHistoryRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { canAccessWorkOrder } from '@/utils/userPermissions'
import { WORK_ORDERS_HISTORY_PAGE_SIZE } from './WorkOrdersHistoryView'

const WorkOrdersHistoryTable = ({
  workOrders,
  tabName,
  pageNumber,
  loadMoreWorkOrders,
}) => {
  const { user } = useContext(UserContext)

  const moreWorkOrdersAvailable = () => {
    // TODO: Replace with a real count from the API
    const maxWorkOrders = pageNumber * WORK_ORDERS_HISTORY_PAGE_SIZE

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

      <Table className="govuk-!-margin-top-5 work-orders-history-table">
        <THead>
          <TR className="lbh-body">
            {user && canAccessWorkOrder(user) && <TH scope="col">Reference</TH>}
            <TH scope="col">Date raised</TH>
            <TH scope="col">Trade</TH>
            <TH scope="col">Status</TH>
            <TH scope="col">Description</TH>
          </TR>
        </THead>
        <TBody>
          {workOrders.map((workOrder, index) => (
            <WorkOrdersHistoryRow key={index} {...workOrder} />
          ))}
        </TBody>
      </Table>
      {workOrders && renderLoadMoreWorkOrders()}
    </>
  )
}

WorkOrdersHistoryTable.propTypes = {
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

export default WorkOrdersHistoryTable

import { useContext, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../../UserContext'
import WorkOrdersHistoryRow from './WorkOrdersHistoryRow'
import HeadingAndFilters from './HeadingAndFilter'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { canAccessWorkOrder } from '@/utils/userPermissions'

const WorkOrdersHistoryTable = ({
  workOrders,
  tabName,
  pageNumber,
  loadMoreWorkOrders,
  pageSize,
}) => {
  const { user } = useContext(UserContext)
  const [tradeToFilterBy, setTradeToFilterBy] = useState(null)

  const moreWorkOrdersAvailable = () => {
    // TODO: Replace with a real count from the API
    const maxWorkOrders = pageNumber * pageSize

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

  const onSelectTrade = (trade) => {
    setTradeToFilterBy(trade)
  }

  const filteredOrders = useMemo(() => {
    return workOrders.filter((order) =>
      order.tradeDescription.includes(tradeToFilterBy)
    )
  }, [tradeToFilterBy, workOrders])

  const clearFilters = () => {
    setTradeToFilterBy(null)
  }

  const RenderWorkOrdersTable = (orders, user) => {
    return (
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
          {orders.map((workOrder, index) => (
            <WorkOrdersHistoryRow
              key={index}
              reference={workOrder.reference}
              dateRaised={new Date(workOrder.dateRaised)}
              tradeDescription={workOrder.tradeDescription}
              description={workOrder.description}
              status={workOrder.status}
            />
          ))}
        </TBody>
      </Table>
    )
  }

  if (!tradeToFilterBy && workOrders.length > 0) {
    return (
      <>
        <HeadingAndFilters
          onSelectTrade={onSelectTrade}
          clearFilters={clearFilters}
          tabName={tabName}
        />
        {RenderWorkOrdersTable(workOrders, user)}
        {workOrders && renderLoadMoreWorkOrders()}
      </>
    )
  }
  // Do we need to be able to load more filteredWorkOrders?
  if (filteredOrders.length > 0) {
    return (
      <>
        <HeadingAndFilters
          onSelectTrade={onSelectTrade}
          clearFilters={clearFilters}
          tabName={tabName}
        />
        {RenderWorkOrdersTable(filteredOrders, user)}
      </>
    )
  }

  if (tradeToFilterBy && filteredOrders.length === 0) {
    return (
      <>
        <HeadingAndFilters
          onSelectTrade={onSelectTrade}
          clearFilters={clearFilters}
          tabName={tabName}
        />
        <h4 className="lbh-heading-h4">
          There are no historical repairs with {tradeToFilterBy}.
        </h4>
      </>
    )
  }
}

WorkOrdersHistoryTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.number,
      dateRaised: PropTypes.string,
      tradeDescription: PropTypes.string,
      status: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  pageNumber: PropTypes.number,
  loadMoreWorkOrders: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
}

export default WorkOrdersHistoryTable

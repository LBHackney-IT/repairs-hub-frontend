import { useContext, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../../UserContext'
import WorkOrdersHistoryRow from './WorkOrdersHistoryRow'
import Spinner from '../../Spinner'
import WorkOrdersHistoryFilter from '../WorkOrdersHistoryFilter/Index'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { canAccessWorkOrder } from '@/utils/userPermissions'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

const WorkOrdersHistoryTable = ({
  workOrders,
  tabName,
  pageNumber,
  loadMoreWorkOrders,
  pageSize,
  propertyReference,
}) => {
  const { user } = useContext(UserContext)
  const [tradeCode, setTradeCode] = useState(null)
  const [tradeDescription, setTradeDescription] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)

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

  const onSelectTrade = async (trade) => {
    if (trade === '') {
      setTradeCode(null)
      return
    }
    try {
      setLoading(true)
      const workOrderFilters = await frontEndApiRequest({
        method: 'get',
        path: '/api/filter/WorkOrder',
      })
      const filterKeyAndDescription = workOrderFilters.Trades.find(
        (element) => element.description === trade
      )
      const filterKey = filterKeyAndDescription.key
      setTradeCode(filterKey)
      setTradeDescription(trade)
      try {
        const data = await frontEndApiRequest({
          path: '/api/workOrders/',
          method: 'get',
          params: {
            propertyReference: propertyReference,
            PageNumber: 1,
            sort: 'dateraised:desc',
            TradeCodes: filterKey,
          },
        })
        setFilteredOrders(data)
      } catch (e) {
        console.error('Failed to fetch filtered work orders:', e.response)
      }
    } catch (e) {
      console.error('An error has occured:', e.response)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setTradeCode(null)
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

  const RenderTableOrNoWorkOrdersFound = () => {
    if (loading) {
      return <Spinner />
    }
    if (!tradeCode && workOrders.length > 0) {
      return (
        <>
          {RenderWorkOrdersTable(workOrders, user)}
          {workOrders && renderLoadMoreWorkOrders()}
        </>
      )
    }
    if (filteredOrders.length > 0) {
      return <>{RenderWorkOrdersTable(filteredOrders, user)}</>
    }
    if (tradeCode && filteredOrders.length === 0) {
      return (
        <h4 className="lbh-heading-h4">
          There are no historical repairs with {tradeDescription}.
        </h4>
      )
    }
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      <WorkOrdersHistoryFilter
        onSelectTrade={(e) => onSelectTrade(e.target.value)}
        clearFilters={clearFilters}
      />
      {RenderTableOrNoWorkOrdersFound()}
    </>
  )
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
  propertyReference: PropTypes.string.isRequired,
}

export default WorkOrdersHistoryTable

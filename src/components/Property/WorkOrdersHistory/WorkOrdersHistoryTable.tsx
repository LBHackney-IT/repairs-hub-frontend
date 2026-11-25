import { useContext, useState, useMemo, useEffect } from 'react'
import UserContext from '../../UserContext'
import WorkOrdersHistoryRow from './WorkOrdersHistoryRow'
import Spinner from '../../Spinner'
import WorkOrdersHistoryFilter from '../WorkOrdersHistoryFilter/Index'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { canAccessWorkOrder } from '@/utils/userPermissions'
import {
  fetchWorkOrderFiltersRequest,
  fetchWorkOrdersRequest,
} from '@/requests/workOrders'

interface Props {
  tabName: string
  workOrders: any[]
  propertyReference: string
  hasMore: boolean
  loadMore: () => void
}

const WorkOrdersHistoryTable = ({
  workOrders,
  tabName,
  propertyReference,
  hasMore,
  loadMore,
}: Props) => {
  const { user } = useContext(UserContext)
  const [tradeCode, setTradeCode] = useState(null)
  const [tradeDescription, setTradeDescription] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const onSelectTrade = async (trade) => {
    if (trade === '') {
      setTradeCode(null)
      return
    }
    try {
      setLoading(true)
      const workOrderFilters = await fetchWorkOrderFiltersRequest()
      const filterKeyAndDescription = workOrderFilters.Trades.find(
        (element) => element.description === trade
      )
      const filterKey = filterKeyAndDescription.key
      setTradeCode(filterKey)
      setTradeDescription(trade)
      try {
        const data = await fetchWorkOrdersRequest({
          propertyReference: propertyReference,
          PageNumber: 1,
          sort: 'dateraised:desc',
          TradeCodes: filterKey,
          PageSize: 0, //Fetch all
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
          {hasMore && (
            <div className="page-navigation govuk-!-padding-bottom-5">
              <button
                className="govuk-button left-page-button"
                data-module="govuk-button"
                onClick={loadMore}
              >
                Load more
              </button>
            </div>
          )}
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

export default WorkOrdersHistoryTable

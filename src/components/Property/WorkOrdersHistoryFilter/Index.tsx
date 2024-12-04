import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

interface WorkOrdersHistoryFilterProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  clearFilters: () => void
}

const WorkOrdersHistoryFilter = ({
  handleChange,
  clearFilters,
}: WorkOrdersHistoryFilterProps) => {
  const [trades, setTrades] = useState(null)

  const getTrades = async () => {
    try {
      const workOrderFilters = await frontEndApiRequest({
        method: 'get',
        path: '/api/filter/WorkOrder',
      })
      setTrades(workOrderFilters.Trades)
    } catch (e) {
      console.error('An error has occured:', e.response)
    }
  }
  useEffect(() => {
    getTrades()
  }, [])

  return (
    <div className="trade-picker-container">
      <label htmlFor="trade-picker" className="govuk-label lbh-label">
        Filter by trade:
      </label>
      {trades !== null && (
        <select
          id="trade-picker"
          className="govuk-select lbh-select"
          name="trade-picker"
          onChange={handleChange}
          data-testid="trade-picker"
        >
          {trades.map((trade, index) => {
            const tradeName = trade.description
            return (
              <option
                data-testid={`trade-option`}
                value={trade.name}
                key={trade.name}
                className="govuk-select lbh-select"
              >
                {tradeName}
              </option>
            )
          })}
        </select>
      )}
      <a
        className="lbh-link lbh-body-xs"
        href="#work-orders-history-tab"
        onClick={clearFilters}
      >
        Clear filters
      </a>
    </div>
  )
}

export default WorkOrdersHistoryFilter

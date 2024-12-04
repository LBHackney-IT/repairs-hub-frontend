import { useEffect, useState, useRef } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

interface WorkOrdersHistoryFilterProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  clearFilters: () => void
  isUnselectable: boolean
}

const WorkOrdersHistoryFilter = ({
  handleChange,
  clearFilters,
}: WorkOrdersHistoryFilterProps) => {
  const [trades, setTrades] = useState(null)
  const selectRef = useRef<HTMLSelectElement>(null)

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

  const handleClearFilters = (e: React.MouseEvent) => {
    e.preventDefault()
    if (selectRef.current) {
      selectRef.current.value = ''
      clearFilters()
    }
  }

  return (
    <div className="trade-picker-container">
      <label htmlFor="trade-picker" className="govuk-label lbh-label">
        Filter by trade:
      </label>
      {trades !== null && (
        <select
          ref={selectRef}
          id="trade-picker"
          className="govuk-select lbh-select"
          name="trade-picker"
          onChange={handleChange}
          data-testid="trade-picker"
        >
          <option value="">Select a trade</option>
          {trades.map((trade, index) => {
            const tradeName = trade.description
            return (
              <option
                data-testid={`trade-option`}
                value={tradeName}
                key={tradeName}
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
        onClick={handleClearFilters}
      >
        Clear filters
      </a>
    </div>
  )
}

export default WorkOrdersHistoryFilter

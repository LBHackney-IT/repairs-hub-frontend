import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

interface WorkOrdersHistoryFilterProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const WorkOrdersHistoryFilter = ({
  handleChange,
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
      <label htmlFor="trade-picker" className="lbh-heading-h4">
        Filter by trade:
      </label>
      {trades !== null && (
        <select id="trade-picker" name="trade-picker" onChange={handleChange}>
          {trades.map((trade, index) => {
            const tradeName = trade.description
            return (
              <option
                data-testid={`trade-option`}
                value={trade.name}
                key={index}
              >
                {tradeName}
              </option>
            )
          })}
        </select>
      )}
    </div>
  )
}

export default WorkOrdersHistoryFilter

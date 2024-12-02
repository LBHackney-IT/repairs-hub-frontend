import { useEffect, useState } from 'react'
import { fetchTrades } from '../../../components/BackOffice/AddSORCodes/utils'

interface WorkOrdersHistoryFilterProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const WorkOrdersHistoryFilter = ({
  handleChange,
}: WorkOrdersHistoryFilterProps) => {
  const [trades, setTrades] = useState(null)

  const getTrades = async () => {
    try {
      const data = await fetchTrades()
      setTrades(data)
    } catch (e) {
      console.error('An error has occured:', e.response)
    }
  }
  useEffect(() => {
    getTrades()
  }, [])

  return (
    <div className="trade-picker-container">
      <label htmlFor="trade-picker" className="lbh-heading-h2">
        Filter by trade:
      </label>
      {trades !== null && (
        <select id="trade-picker" name="trade-picker" onChange={handleChange}>
          {trades.map((trade, index) => {
            const tradeName = trade.name
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

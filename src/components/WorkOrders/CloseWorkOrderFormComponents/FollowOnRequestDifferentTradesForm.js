import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
import { Checkbox, DataList } from '../../Form'
import { useState, useEffect } from 'react'

import { getTrades } from '@/root/src/utils/requests/trades'

const FollowOnRequestDifferentTradesForm = (props) => {
  const { register, requiredFollowOnTrades, watch } = props

  const [trades, setTrades] = useState([])
  const [error, setError] = useState(null)

  const selectedTrades = new Set(requiredFollowOnTrades.map((x) => x.name))

  const isDifferentTradesChecked = watch('followon-trades-other')

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const tradesResponse = await getTrades()
    if (!tradesResponse.success) {
      setError(tradesResponse.error)
      return
    }
    setTrades(tradesResponse.response)
  }
  return (
    <ul>
      {FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map(({ name, label }) => (
        <li style={{ display: 'flex' }} key={name}>
          <Checkbox
            className="govuk-!-margin-0"
            labelClassName="lbh-body-xs govuk-!-margin-0"
            key={name}
            name={name}
            label={label}
            register={register}
            checked={selectedTrades.has(name)}
          />
        </li>
      ))}
      {isDifferentTradesChecked && (
        <DataList
          label=""
          name="otherTrade"
          options={trades.map((trade) => {
            return trade.description
          })}
          defaultValue="Please specify"
          register={register}
          error={error && { message: error }}
        />
      )}
    </ul>
  )
}

export default FollowOnRequestDifferentTradesForm

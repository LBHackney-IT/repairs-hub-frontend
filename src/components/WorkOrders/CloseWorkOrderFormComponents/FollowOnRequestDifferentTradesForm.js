import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
import { Checkbox, DataList } from '../../Form'
import { useState, useEffect } from 'react'

import { getTrades } from '@/root/src/utils/requests/trades'

const FollowOnRequestDifferentTradesForm = (props) => {
  const { register, requiredFollowOnTrades, watch } = props

  const [trades, setTrades] = useState([])
  const [filteredTrades, setFilteredTrades] = useState([])
  const [error, setError] = useState(null)

  const selectedTrades = new Set(requiredFollowOnTrades.map((x) => x.name))

  const isDifferentTradesChecked = watch('followon-trades-other')

  useEffect(() => {
    fetchTrades()
  }, [])

  useEffect(() => {
    filterTrades()
  }, [trades])

  const fetchTrades = async () => {
    const tradesResponse = await getTrades()
    if (!tradesResponse.success) {
      setError(tradesResponse.error)
      return
    }
    setTrades(tradesResponse.response)
  }

  const filterTrades = () => {
    const codesToFilter = [
      'CP',
      'DR',
      'GR',
      'GS',
      'EL',
      'MU',
      'PN',
      'PL',
      'RF',
      'SC',
      'UP',
      'SV',
    ]
    const filteredTrades = trades.filter(
      (trade) => !codesToFilter.includes(trade.key)
    )
    setFilteredTrades(filteredTrades)
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
          label="Please specify"
          name="otherTrade"
          options={filteredTrades.map((trade) => {
            return trade.description
          })}
          register={register({ required: 'Please select a trade' })}
          required={true}
          hint="Select or type a trade"
          error={
            error ||
            (watch('otherTrade') === ''
              ? { message: `This field can't be empty` }
              : null)
          }
        />
      )}
    </ul>
  )
}

export default FollowOnRequestDifferentTradesForm

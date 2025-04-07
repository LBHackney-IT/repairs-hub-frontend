import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
import { Checkbox, DataList } from '../../Form'
import { useState, useEffect } from 'react'
import ErrorMessage from '../../Errors/ErrorMessage'

import { getTrades } from '@/root/src/utils/requests/trades'

const maxLength = 100
const codesToFilter = new Set(
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
  'SV'
)

const FollowOnRequestDifferentTradesForm = (props) => {
  const {
    register,
    requiredFollowOnTrades,
    watch,
    errors,
    hasWhiteBackground,
  } = props

  const [trades, setTrades] = useState([])
  const [error, setError] = useState(null)
  const [remainingCharacterCount, setRemainingCharacterCount] = useState(100)

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

  const filteredTrades = trades.filter((trade) => !codesToFilter.has(trade.key))

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
            hasWhiteBackground={hasWhiteBackground}
          />
        </li>
      ))}
      {isDifferentTradesChecked && (
        <>
          <DataList
            label="Please specify"
            name="otherTrade"
            options={filteredTrades.map((trade) => trade.description)}
            register={register}
            hint="Select or type a trade"
            widthClass="govuk-!-width-full"
            error={errors.otherTrade}
            maxLength={maxLength}
            onChange={(e) =>
              setRemainingCharacterCount(maxLength - e.target.value.length)
            }
            remainingCharacterCount={remainingCharacterCount}
          />
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </ul>
  )
}

export default FollowOnRequestDifferentTradesForm

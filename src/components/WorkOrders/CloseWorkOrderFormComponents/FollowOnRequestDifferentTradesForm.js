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
    setErrors,
    clearErrors,
    hasWhiteBackground,
    isGrid,
    getValues,
  } = props

  const [trades, setTrades] = useState([])
  const [error, setError] = useState(null)
  const [remainingCharacterCount, setRemainingCharacterCount] = useState(100)

  const selectedTrades = new Set(requiredFollowOnTrades.map((x) => x.name))

  const isOtherTradeChecked = watch('followon-trades-other')

  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const validateAtLeastOneTradeSelected = () => {
    if (!selectedFurtherWorkRequired) {
      clearErrors('typeOfWork')
      return
    }
    const tradeNames = FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map(
      (trade) => trade.name
    )
    const currentSelectedTrades = tradeNames.filter((name) => getValues(name))
    const isAnyChecked = currentSelectedTrades.some(
      (name) => getValues(name) === true
    )
    if (!isAnyChecked) {
      setErrors('typeOfWork', {
        type: 'manual',
        message: 'Please select at least one trade',
      })
      return
    }

    clearErrors('typeOfWork')
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const tradesResponse = await getTrades()
    if (!tradesResponse.success) {
      setError(tradesResponse.error.message)
      return
    }
    setTrades(tradesResponse.response)
  }

  const filteredTrades = trades.filter((trade) => !codesToFilter.has(trade.key))

  return (
    <ul
      style={
        isGrid && {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          rowGap: '1rem',
        }
      }
    >
      {FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map(({ name, label }) => (
        <li
          style={{
            ...(isGrid && { marginTop: '0' }),
            ...(name === 'followon-trades-other' && { gridColumn: 'span 2' }),
            display: 'flex',
          }}
          key={name}
        >
          <Checkbox
            className="govuk-!-margin-0"
            labelClassName="lbh-body-xs govuk-!-margin-0"
            key={name}
            name={name}
            label={label}
            register={register({
              validate: () => {
                validateAtLeastOneTradeSelected()
              },
            })}
            checked={selectedTrades.has(name)}
            hasWhiteBackground={hasWhiteBackground}
          />
          {name === 'followon-trades-other' && isOtherTradeChecked && (
            <div
              style={
                isGrid && {
                  paddingLeft: '20px',
                  borderLeft: `3px solid ${error ? '#be3a34' : '#b1b4b6'}`,
                }
              }
            >
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
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default FollowOnRequestDifferentTradesForm

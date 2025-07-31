import PropTypes from 'prop-types'
import { DataList } from '../Form'

const TradeDataList = ({
  disabled,
  trades,
  register,
  errors,
  onTradeSelect,
}) => {
  const tradeList = trades
    .map((trade) => `${trade.name} - ${trade.code}`)
    .filter(Boolean)

  return (
    <DataList
      name="trade"
      label="Trade"
      labelMessage="- Search by type (e.g. Gas) or code (e.g. GS)"
      options={tradeList}
      onChange={onTradeSelect}
      required={true}
      register={register({
        required: 'Please select a trade',
        validate: (value) => tradeList.includes(value) || 'Trade is not valid',
      })}
      error={errors && errors.trade}
      widthClass="govuk-!-width-one-half"
      disabled={disabled}
    />
  )
}

TradeDataList.propTypes = {
  trades: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onTradeSelect: PropTypes.func.isRequired,
}

export default TradeDataList

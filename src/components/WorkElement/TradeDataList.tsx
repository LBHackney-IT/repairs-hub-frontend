import { DataList } from '../Form'

interface Props {
  trades: any[]
  register: (...args: any[]) => any
  errors: any
  onTradeSelect: (...args: any[]) => any
}

const TradeDataList = ({ trades, register, errors, onTradeSelect }: Props) => {
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
    />
  )
}

export default TradeDataList

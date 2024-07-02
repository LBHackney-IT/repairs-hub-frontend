import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
import { Checkbox } from '../../Form'

const FollowOnRequestDifferentTradesForm = (props) => {
  const { register, requiredFollowOnTrades } = props

  const selectedTrades = new Set(requiredFollowOnTrades.map((x) => x.name))

  return (
    <ul>
      {FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map(({ name, label }) => (
        <li style={{ display: 'flex' }}>
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
    </ul>
  )
}

export default FollowOnRequestDifferentTradesForm

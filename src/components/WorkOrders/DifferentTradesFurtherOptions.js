import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '@/utils/statusCodes'
import { Checkbox } from '../Form'

const DifferentTradesFurtherOptions = (props) => {
  const { register } = props

  return (
    <div>
      <ul>
        {/* // Checkboxes */}
        {FOLLOW_ON_REQUEST_AVAILABLE_TRADES.map(({ name, label }) => (
          <li style={{ display: 'flex' }}>
            <Checkbox
              className="govuk-!-margin-0"
              labelClassName="lbh-body-xs govuk-!-margin-0"
              // key={index}
              name={name}
              label={label}
              register={register}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DifferentTradesFurtherOptions

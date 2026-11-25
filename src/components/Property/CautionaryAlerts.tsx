import { useState } from 'react'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import Alerts from './Alerts'
import ErrorMessage from '../Errors/ErrorMessage'
import SpinnerWithLabel from '../SpinnerWithLabel'

interface Props {
  alerts: CautionaryAlert[]
  isLoading?: boolean
  error: string | null
}

const CautionaryAlerts = ({ alerts, isLoading = false, error }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {isLoading && (
        <SpinnerWithLabel resource="alerts" label="Fetching alerts…" />
      )}

      {alerts?.length > 0 && (
        <ul
          className="lbh-list hackney-property-alerts"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: '1em',
            maxWidth: isExpanded ? '' : '30em',
          }}
        >
          <Alerts
            alerts={alerts}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
          />
        </ul>
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default CautionaryAlerts

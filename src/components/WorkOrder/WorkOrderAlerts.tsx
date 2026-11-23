import { useState } from 'react'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import Alerts from '../Property/Alerts'
import ErrorMessage from '../Errors/ErrorMessage'

interface Props {
  alerts: CautionaryAlert[]
  error: string | null
}

const WorkOrderAlerts = ({ alerts, error }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
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

export default WorkOrderAlerts

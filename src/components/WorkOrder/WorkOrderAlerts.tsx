import { useState } from 'react'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import SpinnerWithLabel from '../SpinnerWithLabel'
import Alerts from '../Property/Alerts'
import ErrorMessage from '../Errors/ErrorMessage'

interface Props {
  alerts: CautionaryAlert[]
  isLoading: boolean
  error: string | null
}

const WorkOrderAlerts = ({ alerts, isLoading, error }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {isLoading && (
        <div className="govuk-!-margin-top-2 govuk-!-margin-bottom-4">
          <SpinnerWithLabel label="Fetching alerts…" width={30} />
        </div>
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

export default WorkOrderAlerts

import { useState } from 'react'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import TruncateText from '../Layout/TruncateText'
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
          {alerts.map((alert, index) => (
            <li
              className="bg-orange"
              style={{
                padding: '0.5rem',
                overflow: 'hidden',
                borderRadius: '10px',
              }}
              key={index}
            >
              <p style={{ marginTop: 0 }}>
                {alert.comments} <strong>({alert.type})</strong>
              </p>
              {alert.comments === 'Specific Requirements' && (
                <TruncateText
                  text={alert.reason}
                  numberOfLines="3"
                  pTagClassName="lbh-body-s text-!-white"
                  linkClassName="lbh-body-xs text-!-white"
                  setIsExpanded={setIsExpanded}
                  isExpanded={isExpanded}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default CautionaryAlerts

import type { CautionaryAlert } from '@/root/src/models/cautionaryAlerts'
import TruncateText from '../Layout/TruncateText'

interface Props {
  alerts: (CautionaryAlert & { reason?: string })[]
  setIsExpanded?: (isExpanded: boolean) => void
  isExpanded?: boolean
}

const Alerts = ({ alerts, setIsExpanded, isExpanded }: Props) => {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
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
        )
      })}
    </>
  )
}

export default Alerts

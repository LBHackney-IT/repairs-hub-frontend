import { useState } from 'react'
import ErrorMessage from '../Errors/ErrorMessage'
import Spinner from '../Spinner'
import WarningInfoBox from '../Template/WarningInfoBox'
import { usePropertyFlags } from './usePropertyFlags'
import Alerts from '../Property/Alerts'
import { Tenure } from '@/root/src/models/propertyTenure'
import PropertyFlags from '../Property/PropertyFlags'

interface Props {
  propertyReference: string
  canRaiseRepair: boolean
  tenure: Tenure
}

const PropertyFlagsWrapper = (props: Props) => {
  const { propertyReference, canRaiseRepair, tenure } = props

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const {
    isInLegalDisrepair,
    legalDisrepairError,
    alerts,
    alertsError,
    loading,
  } = usePropertyFlags(propertyReference)

  return (
    <>
      {loading && <Spinner resource='propertyFlags' />}

      {isInLegalDisrepair && !loading && (
        <WarningInfoBox
          header="This property is currently under legal disrepair"
          text="Before raising a work order you must call the Legal Disrepair Team"
        />
      )}

      {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}

      <div className="lbh-body-s">
        {!loading && alerts?.length > 0 && (
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

        {alertsError && <ErrorMessage label={alertsError} />}

        <PropertyFlags canRaiseRepair={canRaiseRepair} tenure={tenure} />
      </div>
    </>
  )
}

export default PropertyFlagsWrapper

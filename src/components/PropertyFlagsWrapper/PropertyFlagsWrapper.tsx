import ErrorMessage from '../Errors/ErrorMessage'
import Spinner from '../Spinner'
import WarningInfoBox from '../Template/WarningInfoBox'
import { useLegalDisrepairStatus } from '@/requests/hooks/useLegalDisrepairStatus'
import { useCautionaryAlerts } from '@/requests/hooks/useCautionaryAlerts'
import CautionaryAlerts from '../Property/CautionaryAlerts'
import { Property, Tenure } from '@/root/src/models/propertyTenure'
import PropertyFlags from '../Property/PropertyFlags'
import { HealthAndSafetyHazardAlert } from '../Alerts/HealthAndSafetyHazardAlert'
import { SimpleFeatureToggleResponse } from '../../pages/api/simple-feature-toggle'

interface Props {
  propertyReference: string
  tenure: Tenure
  property: Property
  simpleFeatureToggles: SimpleFeatureToggleResponse
}

const PropertyFlagsWrapper = (props: Props) => {
  const { propertyReference, property, tenure, simpleFeatureToggles } = props

  const {
    isInLegalDisrepair,
    error: legalDisrepairError,
    isLoading: legalDisrepairLoading,
  } = useLegalDisrepairStatus(propertyReference)

  const {
    alerts,
    error: alertsError,
    isLoading: alertsLoading,
  } = useCautionaryAlerts(propertyReference)

  const loading = legalDisrepairLoading || alertsLoading

  return (
    <>
      {loading && <Spinner resource="propertyFlags" />}

      {isInLegalDisrepair && !loading && (
        <WarningInfoBox
          header="This property is currently under legal disrepair"
          text="Before raising a work order you must call the Legal Disrepair Team"
        />
      )}

      {simpleFeatureToggles?.enableHealthAndSafetyFlag && (
        <HealthAndSafetyHazardAlert
          message={property?.healthAndSafetyRatingMessage}
        />
      )}

      {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}

      <div className="lbh-body-s">
        {!loading && <CautionaryAlerts alerts={alerts} error={alertsError} />}

        <PropertyFlags
          canRaiseRepair={property?.canRaiseRepair}
          tenure={tenure}
        />
      </div>
    </>
  )
}

export default PropertyFlagsWrapper

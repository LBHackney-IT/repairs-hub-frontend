import PropertyDetails from './PropertyDetails'
import SpinnerWithLabel from '../SpinnerWithLabel'
import ErrorMessage from '../Errors/ErrorMessage'
import Meta from '../Meta'
import WorkOrdersHistoryView from './WorkOrdersHistory/WorkOrdersHistoryView'
import { TabName } from '../Tabs/tabNames'
import { Tenure } from '../../models/propertyTenure'
import { useSimpleFeatureToggles } from '../../hooks/useSimpleFeatureToggle'
import { usePropertyTenure } from '@/requests/hooks/usePropertyTenure'
import { useAlerts } from '@/requests/hooks/useAlerts'
import { useLegalDisrepairStatus } from '@/requests/hooks/useLegalDisrepairStatus'

interface Props {
  propertyReference: string
}

const PropertyView = ({ propertyReference }: Props) => {
  const {
    property,
    tenure,
    isLoading: propertyLoading,
    error: propertyError,
  } = usePropertyTenure(propertyReference)

  const {
    isInLegalDisrepair,
    isLoading: legalDisrepairLoading,
    error: legalDisrepairError,
  } = useLegalDisrepairStatus(propertyReference)

  // Not part of detailsLoading: the alerts can be slow, so they shouldn't hold
  // up the page. Started here so the request runs alongside the others
  const { alerts, isLoading: alertsLoading, error: alertsError } = useAlerts(
    propertyReference
  )

  const [
    simpleFeatureToggles,
    featureTogglesLoading,
  ] = useSimpleFeatureToggles()

  const detailsLoading =
    propertyLoading || legalDisrepairLoading || featureTogglesLoading

  const detailsReady =
    !detailsLoading && !!property?.address && !!property?.hierarchyType

  return (
    <>
      <Meta title={property?.address?.addressLine} />

      {detailsLoading && (
        <SpinnerWithLabel label="Fetching property details…" />
      )}

      {detailsReady && (
        <PropertyDetails
          property={property}
          tenure={tenure ?? ({} as Tenure)}
          showLegalDisrepairFlag={isInLegalDisrepair}
          showUnderWarrantyFlag={property.isUnderWarranty}
          showHealthAndSafetyFlag={
            simpleFeatureToggles?.enableHealthAndSafetyFlag
          }
          alerts={alerts}
          alertsLoading={alertsLoading}
          alertsError={alertsError}
        />
      )}

      {/* The history is mounted straight away, but kept hidden until the
          details above are ready, so it loads its data in parallel instead of
          only starting once it becomes visible */}
      {!propertyError && (
        <div style={detailsReady ? undefined : { display: 'none' }}>
          <WorkOrdersHistoryView
            propertyReference={propertyReference}
            tabName={TabName.WorkOrderHistory}
          />
        </div>
      )}

      {propertyError && <ErrorMessage label={propertyError} />}
      {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}
    </>
  )
}

export default PropertyView

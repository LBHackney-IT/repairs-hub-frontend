import PropertyDetails from './PropertyDetails'
import SpinnerWithLabel from '../SpinnerWithLabel'
import ErrorMessage from '../Errors/ErrorMessage'
import Meta from '../Meta'
import WorkOrdersHistoryView from './WorkOrdersHistory/WorkOrdersHistoryView'
import { TabName } from '../Tabs/tabNames'
import { Tenure } from '../../models/propertyTenure'
import { useSimpleFeatureToggles } from '../../hooks/useSimpleFeatureToggle'
import { usePropertyTenure } from '@/requests/hooks/usePropertyTenure'
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

  const [
    simpleFeatureToggles,
    featureTogglesLoading,
  ] = useSimpleFeatureToggles()

  if (propertyLoading || legalDisrepairLoading || featureTogglesLoading)
    return <SpinnerWithLabel label="Fetching property details…" />

  return (
    <>
      <Meta title={property?.address?.addressLine} />
      {property?.address && property?.hierarchyType && (
        <>
          <PropertyDetails
            property={property}
            tenure={tenure ?? ({} as Tenure)}
            showLegalDisrepairFlag={isInLegalDisrepair}
            showUnderWarrantyFlag={property.isUnderWarranty}
            showHealthAndSafetyFlag={
              simpleFeatureToggles?.enableHealthAndSafetyFlag
            }
          />
          <WorkOrdersHistoryView
            propertyReference={propertyReference}
            tabName={TabName.WorkOrderHistory}
          />
        </>
      )}

      {propertyError && <ErrorMessage label={propertyError} />}
      {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}
    </>
  )
}

export default PropertyView

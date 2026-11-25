import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import Meta from '../Meta'
import PropertyViewTabs from '../Tabs/Views/PropertyViewTabs'
import { Tenure } from '../../models/propertyTenure'
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

  if (propertyLoading || legalDisrepairLoading) return <Spinner />

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
          />
          <PropertyViewTabs propertyReference={propertyReference} />
        </>
      )}

      {propertyError && <ErrorMessage label={propertyError} />}
      {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}
    </>
  )
}

export default PropertyView

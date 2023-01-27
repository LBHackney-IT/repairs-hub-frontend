
import RaiseWorkOrderStatus from './RaiseWorkOrderStatus'
import PropertyDetailsGrid from './PropertyDetailsGrid'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOutOfHours } from '@/utils/helpers/completionDateTimes'
import Link from 'next/link'
import { Address, HierarchyType, Tenure } from './types'
import { FunctionComponent } from 'react'

interface Props {
  propertyReference: string
  address: Address
  hierarchyType: HierarchyType
  canRaiseRepair: boolean
  tenure: Tenure
  tmoName: string
}

const PropertyDetails: FunctionComponent<Props> = ({
  propertyReference,
  address,
  hierarchyType,
  canRaiseRepair,
  tenure,
  tmoName,
}) => {
  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
        {hierarchyType.subTypeDescription}: {address.addressLine}
      </h1>
      <div>
        <RaiseWorkOrderStatus
          canRaiseRepair={canRaiseRepair}
          description={hierarchyType.subTypeDescription}
          propertyReference={propertyReference}
        />
      </div>

      {isCurrentTimeOutOfHours() && (
        <div>
          <Link href={process.env.NEXT_PUBLIC_OUT_OF_HOURS_LINK}>
            <a
              target="_blank"
              rel="noopener"
              className="lbh-link lbh-body-l lbh-!-font-weight-medium"
            >
              Out of hours note
            </a>
          </Link>
        </div>
      )}

      <PropertyDetailsGrid
        propertyReference={propertyReference}
        address={address}
        subTypeDescription="Property details"
        tenure={tenure}
        canRaiseRepair={canRaiseRepair}
        hasLinkToProperty={false}
        tmoName={tmoName}
      />
    </div>
  )
}

export default PropertyDetails

import PropTypes from 'prop-types'
import RaiseWorkOrderStatus from './RaiseWorkOrderStatus'
import PropertyDetailsGrid from './PropertyDetailsGrid'
import BackButton from '../Layout/BackButton/BackButton'
import { isCurrentTimeOutOfHours } from '../../utils/helpers/completionDateTimes'
import Link from 'next/link'

const PropertyDetails = ({
  propertyReference,
  address,
  hierarchyType,
  canRaiseRepair,
  locationAlerts,
  personAlerts,
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
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
        subTypeDescription="Property details"
        tenure={tenure}
        canRaiseRepair={canRaiseRepair}
        hasLinkToProperty={false}
        tmoName={tmoName}
      />
    </div>
  )
}

PropertyDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  tmoName: PropTypes.string,
}

export default PropertyDetails

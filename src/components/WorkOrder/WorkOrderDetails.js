import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import WorkOrderHeader from './WorkOrderHeader'
import BackButton from '../Layout/BackButton/BackButton'
import Link from 'next/link'

const WorkOrderDetails = ({
  propertyReference,
  workOrder,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  canRaiseRepair,
}) => {
  const { user } = useContext(UserContext)
  const STATUS_CANCELLED = 'Work Cancelled'

  return (
    <div>
      <BackButton />
      <div>
        <h1 className="govuk-heading-l display-inline govuk-!-margin-right-6">
          Works order: {workOrder.reference}
        </h1>
        {user && user.hasContractorPermissions && (
          <Link href={`/repairs/jobs/${workOrder.reference}/choose-option`}>
            <a className="govuk-body-m">Update Works Order</a>
          </Link>
        )}
        {user && user.hasContractManagerPermissions && (
          <Link href={`/repairs/jobs/${workOrder.reference}/authorisation`}>
            <a className="govuk-body-m">Update Works Order</a>
          </Link>
        )}
        {user &&
          user.hasAgentPermissions &&
          workOrder.status !== STATUS_CANCELLED && (
            <Link href={`/work-orders/${workOrder.reference}/cancel`}>
              <a className="govuk-body-m">Cancel Works Order</a>
            </Link>
          )}
      </div>
      <p className="govuk-body-m">{workOrder.description}</p>

      <WorkOrderHeader
        propertyReference={propertyReference}
        workOrder={workOrder}
        address={address}
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
        subTypeDescription={subTypeDescription}
        tenure={tenure}
        hasLinkToProperty={true}
        canRaiseRepair={canRaiseRepair}
      />
    </div>
  )
}

WorkOrderDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default WorkOrderDetails

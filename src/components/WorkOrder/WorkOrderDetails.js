import PropTypes from 'prop-types'
import WorkOrderHeader from './WorkOrderHeader'
import Link from 'next/link'
import { convertDate } from '../../utils/date'
import { canCancelWorkOrder } from '../../utils/helpers/cancel-work-order'

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
  const workOrderDateRaised = convertDate(workOrder.dateRaised)

  return (
    <div>
      <div>
        <h1 className="govuk-heading-l display-inline govuk-!-margin-right-6">
          Works order: {workOrder.reference}
        </h1>
        {workOrder.status !== 'Work Cancelled' &&
          canCancelWorkOrder(workOrderDateRaised) && (
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

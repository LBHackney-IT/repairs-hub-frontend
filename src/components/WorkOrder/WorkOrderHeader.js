import PropTypes from 'prop-types'
import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import PropertyFlags from '../Property/PropertyFlags'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'
import { formatDateTime } from 'src/utils/time'
import { WorkOrder } from '@/models/workOrder'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import FurtherWorkRequiredFlag from './FurtherWorkRequiredFlag'

const WorkOrderHeader = ({
  propertyReference,
  workOrder,
  address,
  subTypeDescription,
  tenure,
  canRaiseRepair,
  setLocationAlerts,
  setPersonAlerts,
}) => {
  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )

  return (
    <div className="lbh-body-s govuk-grid-row govuk-!-margin-bottom-6">
      <div className="govuk-grid-column-one-third">
        <PropertyDetailsAddress
          address={address}
          propertyReference={propertyReference}
          subTypeDescription={subTypeDescription}
          hasLinkToProperty={true}
        />

        <PropertyFlags
          tenure={tenure}
          canRaiseRepair={canRaiseRepair}
          propertyReference={propertyReference}
          setParentLocationAlerts={setLocationAlerts}
          setParentPersonAlerts={setPersonAlerts}
        />
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderInfo workOrder={workOrder} />
      </div>
      <div className="govuk-grid-column-one-third">
        <AppointmentDetails workOrder={workOrder} />
        <div className="lbh-body-xs govuk-!-margin-top-1">
          <span>Assigned to: {workOrder.owner}</span>
        </div>
        {workOrder.closedDated && (
          <div className="lbh-body-xs">
            <span>
              <strong>
                {workOrder.completionReason()}:{' '}
                {formatDateTime(new Date(workOrder.closedDated))}
              </strong>
            </span>
          </div>
        )}

        {'followOnRequest' in workOrder &&
          workOrder.followOnRequest !== null && <FurtherWorkRequiredFlag />}

        {workOrder.operatives.length > 0 &&
          ((workOrder.appointment && workOrder.appointmentISODatePassed()) ||
            readOnly) && <Operatives operatives={workOrder.operatives} />}
      </div>
    </div>
  )
}

WorkOrderHeader.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  setLocationAlerts: PropTypes.func,
  setPersonAlerts: PropTypes.func,
}

export default WorkOrderHeader

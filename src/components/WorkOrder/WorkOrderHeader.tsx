import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import PropertyFlags from '../Property/PropertyFlags'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'
import { formatDateTime } from 'src/utils/time'
import { WorkOrder } from '@/models/workOrder'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import FurtherWorkRequiredFlag from '../Flags/FurtherWorkRequiredFlag'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import { Tenure } from '../../models/tenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

interface Props {
  propertyReference: string
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  address: object
  subTypeDescription: string
  tenure: Tenure
  canRaiseRepair: boolean
  setLocationAlerts: (alerts: CautionaryAlert[]) => void
  setPersonAlerts: (alerts: CautionaryAlert[]) => void
}

const WorkOrderHeader = (props: Props) => {
  const {
    propertyReference,
    workOrder,
    appointmentDetails,
    address,
    subTypeDescription,
    tenure,
    canRaiseRepair,
    setLocationAlerts,
    setPersonAlerts,
  } = props

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
        <AppointmentDetails
          workOrder={workOrder}
          appointmentDetails={appointmentDetails}
        />
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

        {appointmentDetails.operatives.length > 0 &&
          ((appointmentDetails.appointment &&
            appointmentDetails.appointmentISODatePassed()) ||
            readOnly) && (
            <Operatives operatives={appointmentDetails.operatives} />
          )}
      </div>
    </div>
  )
}

export default WorkOrderHeader

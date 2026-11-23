import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import WorkOrderHeader from './WorkOrderHeader'
import WorkOrderPageHeading from './WorkOrderPageHeading'
import MultiButton from '../Layout/MultiButton'
import { WORK_ORDER_ACTIONS } from 'src/utils/workOrderActions'
import { WorkOrder } from '@/models/workOrder'
import FollowOnFlag from '../Flags/FollowOnFlag'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import { Property, Tenure } from '../../models/propertyTenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import Spinner from '../Spinner'
import Alerts from '../Property/Alerts'
import ErrorMessage from '../Errors/ErrorMessage'

interface Props {
  property: Property
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  loadingAppointmentDetails: boolean
  tenure: Tenure
  alertsLoading: boolean
  alertsError: string | null
  alerts: CautionaryAlert[]
  printClickHandler: () => void
}

const WorkOrderDetails = (props: Props) => {
  const {
    property,
    workOrder,
    appointmentDetails,
    appointmentDetailsError,
    loadingAppointmentDetails,
    tenure,
    printClickHandler,
    alerts,
    alertsLoading,
    alertsError,
  } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const { user } = useContext(UserContext)

  const workOrderActionMenu = () => {
    return WORK_ORDER_ACTIONS.filter((choice) => {
      if (choice.disabled) {
        return false
      }

      if (
        choice.permittedRoles.some((role) => user.roles.includes(role)) &&
        choice.permittedStatuses.includes(workOrder.status)
      ) {
        return true
      }
    }).map((action) => {
      if (action.href === 'print') {
        return {
          ...action,
          onClickHandler: (e) => {
            e.preventDefault()
            printClickHandler()
          },
        }
      }

      return action
    })
  }

  const currentWorkOrderActionMenu = workOrderActionMenu()

  return (
    <>
      <div className="govuk-!-display-none-print">
        <WorkOrderPageHeading workOrderReference={workOrder.reference}>
          {currentWorkOrderActionMenu?.length > 0 && !workOrder.closedDated && (
            <MultiButton
              name="workOrderMenu"
              label="Select work order"
              secondary={false}
              choices={currentWorkOrderActionMenu}
              workOrderReference={workOrder.reference}
            />
          )}
        </WorkOrderPageHeading>

        {workOrder?.isFollowOn && (
          <div className="govuk-!-margin-top-2">
            <FollowOnFlag />
          </div>
        )}

        <p className="lbh-body-m">{workOrder.description}</p>
        {alertsLoading && <Spinner resource="alerts" />}
        {alerts?.length > 0 && (
          <ul
            className="lbh-list hackney-property-alerts"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: '1em',
              maxWidth: isExpanded ? '' : '30em',
            }}
          >
            <Alerts
              alerts={alerts}
              setIsExpanded={setIsExpanded}
              isExpanded={isExpanded}
            />
          </ul>
        )}
        {alertsError && <ErrorMessage label={alertsError} />}

        <WorkOrderHeader
          propertyReference={property.propertyReference}
          workOrder={workOrder}
          appointmentDetails={appointmentDetails}
          appointmentDetailsError={appointmentDetailsError}
          loadingAppointmentDetails={loadingAppointmentDetails}
          address={property.address}
          subTypeDescription={property.hierarchyType.subTypeDescription}
          tenure={tenure}
          canRaiseRepair={property.canRaiseRepair}
        />
      </div>
    </>
  )
}

export default WorkOrderDetails

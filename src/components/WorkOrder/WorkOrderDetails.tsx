import { useContext, useEffect, useState } from 'react'
import UserContext from '../UserContext'
import { getAlerts } from '../../utils/requests/property'
import WorkOrderHeader from './WorkOrderHeader'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
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
  setParentAlerts: (alerts: CautionaryAlert[]) => void
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
    setParentAlerts,
  } = props

  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [alertsError, setAlertsError] = useState<string | null>()
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

  const fetchAlerts = async () => {
    setAlertsLoading(true)
    const alertsResponse = await getAlerts(property.propertyReference)

    if (!alertsResponse.success) {
      setAlertsError(alertsResponse.error.message)
      setAlertsLoading(false)
      return
    }

    setAlerts(alertsResponse.response.alerts)
    setAlertsLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <>
      <div className="govuk-!-display-none-print">
        <BackButton />

        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="lbh-heading-h1 display-inline govuk-!-margin-right-6">
              Work order: {workOrder.reference.toString().padStart(8, '0')}
            </h1>
          </GridColumn>
          <GridColumn width="one-third">
            {currentWorkOrderActionMenu?.length > 0 &&
              !workOrder.closedDated && (
                <MultiButton
                  name="workOrderMenu"
                  label="Select work order"
                  secondary={false}
                  choices={currentWorkOrderActionMenu}
                  workOrderReference={workOrder.reference}
                />
              )}
          </GridColumn>
        </GridRow>

        {workOrder?.isFollowOn && (
          <div className="govuk-!-margin-top-2">
            <FollowOnFlag />
          </div>
        )}

        <p className="lbh-body-m">{workOrder.description}</p>
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
          {alertsLoading && <Spinner resource="alerts" />}
          {alerts?.length > 0 && (
            <Alerts
              alerts={alerts}
              setIsExpanded={setIsExpanded}
              isExpanded={isExpanded}
            />
          )}

          {alertsError && <ErrorMessage label={alertsError} />}
        </ul>

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

import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import PropertyFlags from '../Property/PropertyFlags'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'
import { formatDateTime } from 'src/utils/time'
import { WorkOrder } from '@/models/workOrder'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import FurtherWorkRequiredFlag from '../Flags/FurtherWorkRequiredFlag'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import { WorkOrderAppointmentDetails } from './types'

interface Props {
  propertyReference: string
  workOrder: WorkOrder
  address: any
  subTypeDescription: string
  tenure: any
  canRaiseRepair: boolean
  setLocationAlerts: () => void
  setPersonAlerts: () => void
}

const WorkOrderHeader = (props: Props) => {
  const {
    propertyReference,
    workOrder,
    address,
    subTypeDescription,
    tenure,
    canRaiseRepair,
    setLocationAlerts,
    setPersonAlerts,
  } = props

  const [
    appointmentDetails,
    setAppointmentDetails,
  ] = useState<WorkOrderAppointmentDetails>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAppointments = async () => {
    setIsLoading(true)
    const appointments: WorkOrderAppointmentDetails = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/appointments/${workOrder.reference}/`,
    })

    setAppointmentDetails(appointments)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

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
        <div>
          <p className="govuk-!-font-size-14">Appointment details</p>
          {isLoading ? (
            <span
              style={{
                color: '#64748b',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Spinner width={20} height={20} />
              <span style={{ margin: '0 0 0 10px' }}>
                Fetching latest appointment details from DRS...
              </span>
            </span>
          ) : (
            <div
              style={{
                background: '#fafafa',
                padding: 15,
                marginTop: 5,
              }}
            >
              <AppointmentDetails
                appointmentDetails={appointmentDetails}
                workOrder={workOrder}
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
                workOrder.followOnRequest !== null && (
                  <FurtherWorkRequiredFlag />
                )}

              {appointmentDetails?.operatives?.length > 0 &&
                ((appointmentDetails?.appointment &&
                  workOrder.appointmentISODatePassed()) ||
                  readOnly) && (
                  <Operatives operatives={appointmentDetails?.operatives} />
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkOrderHeader

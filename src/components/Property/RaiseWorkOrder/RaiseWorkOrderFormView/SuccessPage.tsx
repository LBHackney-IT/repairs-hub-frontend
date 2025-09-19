import {
  createWOLinks,
  LinksWithDRSBooking,
} from '@/root/src/utils/successPageLinks'
import { Property } from '@/root/src/models/propertyTenure'
import { CurrentUser } from '@/root/src/types/variations/types'
import SuccessPage from '@/components/SuccessPage'
import Panel from '../../../Template/Panel'

interface Props {
  immediateOrEmergencyRepairText: boolean
  immediateOrEmergencyDLO: boolean
  authorisationPendingApproval: boolean
  workOrderReference: string
  externallyManagedAppointment: boolean
  property: Property
  currentUser: CurrentUser
  externalAppointmentManagementUrl: string
}

const RaiseWorkOrderSuccessPage = (props: Props) => {
  const {
    immediateOrEmergencyRepairText,
    immediateOrEmergencyDLO,
    authorisationPendingApproval,
    workOrderReference,
    externallyManagedAppointment,
    property,
    currentUser,
    externalAppointmentManagementUrl,
  } = props

  const warningTextToShow = () => {
    if (immediateOrEmergencyRepairText) {
      if (immediateOrEmergencyDLO) {
        return 'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked'
      } else
        return 'Emergency and immediate repairs must be booked immediately. Please call the external contractor'
    } else if (authorisationPendingApproval) {
      return 'Please request authorisation from a manager'
    } else {
      return ''
    }
  }

  return (
    <SuccessPage
      banner={
        <Panel
          title="Work order created"
          authorisationText={
            authorisationPendingApproval && 'but requires authorisation'
          }
          workOrderReference={workOrderReference}
        />
      }
      warningText={warningTextToShow()}
      links={
        externallyManagedAppointment
          ? LinksWithDRSBooking(
              workOrderReference,
              property,
              externalAppointmentManagementUrl,
              currentUser.name
            )
          : createWOLinks(workOrderReference, property)
      }
    />
  )
}

export default RaiseWorkOrderSuccessPage

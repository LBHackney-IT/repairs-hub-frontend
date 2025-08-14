import {
  createWOLinks,
  LinksWithDRSBooking,
} from '@/root/src/utils/successPageLinks'
import SuccessPage from '../../SuccessPage'
import Panel from '../../Template/Panel'
import { Property } from '@/root/src/models/propertyTenure'
import { CurrentUser } from '@/root/src/types/variations/types'

interface Props {
  workOrderReference: string
  authorisationPendingApproval: boolean
  immediateOrEmergencyRepairText: boolean
  immediateOrEmergencyDLO: boolean
  externallyManagedAppointment: boolean
  property: Property
  externalAppointmentManagementUrl: string
  currentUser: CurrentUser
}

const RaiseWorkOrderSuccessView = (props: Props) => {
  const {
    workOrderReference,
    authorisationPendingApproval,
    immediateOrEmergencyRepairText,
    immediateOrEmergencyDLO,
    externallyManagedAppointment,
    property,
    externalAppointmentManagementUrl,
    currentUser,
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
    <>
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
    </>
  )
}

export default RaiseWorkOrderSuccessView

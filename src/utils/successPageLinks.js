import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { useContext } from 'react'
import UserContext from '@/components/UserContext'

export const IMMEDIATE_OR_EMERGENCY_DLO_REPAIR_TEXT =
  'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked.'
export const AUTHORISATION_REQUIRED_TEXT =
  'Please request authorisation from a manager.'

const openExternalLinkEventHandler = async (workOrderReference) => {
  const { user } = useContext(UserContext)
  const jobStatusUpdate = buildDataFromScheduleAppointment(
    workOrderReference.toString(),
    `${user.name} opened the DRS Web Booking Manager`
  )

  await frontEndApiRequest({
    method: 'post',
    path: `/api/jobStatusUpdate`,
    requestData: jobStatusUpdate,
  })
}

export const generalLinks = (workOrderReference, property) => {
  return [
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    {
      href: `/properties/${property.propertyReference}`,
      text: `Back to ${property.address.addressLine}`,
    },
    { href: `/`, text: 'Start a new search' },
  ]
}

export const LinksWithDRSBooking = (
  workOrderReference,
  property,
  externalAppointmentManagementUrl
) => {
  return [
    {
      href: { externalAppointmentManagementUrl },
      text: 'Book an appointment on DRS',
      onClick: () => openExternalLinkEventHandler(workOrderReference),
      target: '_blank',
      rel: 'noopener',
    },
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    {
      href: `/properties/${property.propertyReference}`,
      text: `Back to ${property.address.addressLine}`,
    },
    { href: `/`, text: 'Start a new search' },
  ]
}

export const cancelWorkOrderLinks = (
  workOrderReference,
  propertyReference,
  shortAddress
) => {
  return [
    {
      href: `/properties/${propertyReference}/raise-repair/new`,
      text: `Raise a new work order for ${shortAddress}`,
    },
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    { href: `/`, text: 'Start a new search' },
  ]
}

export const closeWorkOrderLinks = (workOrderReference) => {
  return [
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    { href: `/`, text: 'Manage work orders' },
  ]
}

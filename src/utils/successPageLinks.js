import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

const openExternalLinkEventHandler = async (workOrderReference, userName) => {
  const jobStatusUpdate = buildDataFromScheduleAppointment(
    workOrderReference.toString(),
    `${userName} opened the DRS Web Booking Manager`
  )

  try {
    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: jobStatusUpdate,
    })
  } catch (e) {
    console.error(e)
  }
}

export const createWOLinks = (workOrderReference, property) => {
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
  externalAppointmentManagementUrl,
  userName
) => {
  return [
    {
      href: externalAppointmentManagementUrl,
      text: 'Book an appointment on DRS',
      onClick: () => openExternalLinkEventHandler(workOrderReference, userName),
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

export const generalLinks = (workOrderReference) => {
  return [
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    { href: `/`, text: 'Manage work orders' },
  ]
}

export const updateWorkOrderLinks = (workOrderReference) => {
  return [
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    {
      href: `/work-orders/${workOrderReference}/close`,
      text: 'Close work order',
    },
    { href: `/`, text: 'Manage work orders' },
  ]
}

export const rejectLinks = (
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
    { href: `/`, text: 'Manage work orders' },
  ]
}

export const authorisationApprovedLinks = (workOrderReference) => {
  return [
    {
      href: `/work-orders/${workOrderReference}/appointment/new`,
      text: 'Book an appointment on DRS',
    },
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work order',
    },
    { href: `/`, text: 'Manage work orders' },
  ]
}

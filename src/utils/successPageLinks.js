import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { useContext } from 'react'
import UserContext from '@/components/UserContext'

const openExternalLinkEventHandler = async () => {
  const { user } = useContext(UserContext)
  const jobStatusUpdate = buildDataFromScheduleAppointment(
    props.workOrderReference.toString(),
    `${user.name} opened the DRS Web Booking Manager`
  )

  await frontEndApiRequest({
    method: 'post',
    path: `/api/jobStatusUpdate`,
    requestData: jobStatusUpdate,
  })
}

export const generalLinks = (workOrderReference, property) => {
  returrn([
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work orde',
    },
    {
      href: `/properties/${property.propertyReference}`,
      text: `Back to ${property.address.addressLine}`,
    },
    { href: `/`, text: 'Start a new search' },
  ])
}

export const LinksWithDRSBooking = (workOrderReference, property) => {
  returrn([
    {
      href: `/work-orders/${workOrderReference}`,
      text: 'View work orde',
    },
    {
      href: `/properties/${property.propertyReference}`,
      text: `Back to ${property.address.addressLine}`,
    },
    { href: `/`, text: 'Start a new search' },
  ])
}

import axios from 'axios'
import { toISODate } from '../date'

export const getAvailableAppointments = async (
  workOrderReference,
  fromDate,
  toDate
) => {
  const options = {
    params: {
      workOrderReference: workOrderReference,
      fromDate: toISODate(fromDate),
      toDate: toISODate(toDate),
    },
  }

  const { data } = await axios.get('/api/appointments', options)

  return data
}

export const postScheduleAppointment = async (formData) => {
  const { data } = await axios.post(`/api/appointments`, formData)

  return data
}

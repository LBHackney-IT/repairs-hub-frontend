import { frontEndApiRequest } from '../frontEndApiClient/requests'

export interface AvailableAppointmentsParams {
  workOrderReference: string
  fromDate: string
  toDate: string
}

export const fetchAvailableAppointmentsRequest = (
  params: AvailableAppointmentsParams
) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/appointments',
    params,
  })

export const createAppointmentRequest = (requestData: object) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/appointments`,
    requestData,
  })

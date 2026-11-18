import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const fetchAvailableAppointmentsRequest = (params: object) =>
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

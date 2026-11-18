import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const fetchOperativesRequest = () =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/operatives`,
  })

export const fetchOperativeAppointmentsRequest = (
  operativePayrollNumber: string,
  { date, timeout }: { date?: string; timeout?: number } = {}
) =>
  frontEndApiRequest({
    method: 'get',
    path:
      date !== undefined
        ? `/api/operatives/${operativePayrollNumber}/appointments?date=${date}`
        : `/api/operatives/${operativePayrollNumber}/appointments`,
    ...(timeout !== undefined && { timeout }),
  })

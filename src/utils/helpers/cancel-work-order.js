import { calculateNewDateTimeFromDate } from '../date'

export const canCancelWorkOrder = (workOrderDateRaised) => {
  // Returns true if within 1 hour of work order being raised
  return new Date() < calculateNewDateTimeFromDate(workOrderDateRaised, 1)
}

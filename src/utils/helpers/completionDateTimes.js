import { isWeekend, format, getHours, isWithinInterval } from 'date-fns'
import { bankHolidays } from './bankHolidays'
import { lowPriorityHolidays } from './lowPriorityHolidays'

const WORKDAY_START_HOUR = 8
const WORKDAY_END_HOUR = 18

export const isBankHoliday = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd')
  const englandWalesBankHolidays = bankHolidays['england-and-wales']['events']

  return englandWalesBankHolidays.some(
    (bankHoliday) => formattedDate === bankHoliday.date
  )
}

export const isCurrentTimeOutOfHours = () => {
  const now = new Date()

  if (isNonWorkingDay(now)) {
    return true
  } else {
    if (
      getHours(now) < WORKDAY_START_HOUR ||
      getHours(now) >= WORKDAY_END_HOUR
    ) {
      return true
    }
  }

  return false
}

export const isNonWorkingDay = (date, lowPriority = false) =>
  isWeekend(date) ||
  isBankHoliday(date) ||
  (lowPriority && isLowPriorityHoliday(date))

// Sometimes Hackney have holidays which only apply to low priority orders.
const isLowPriorityHoliday = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd')

  return lowPriorityHolidays.some((holiday) => holiday === formattedDate)
}

export const isCurrentTimeOperativeOvertime = () => {
  return isOperativeOverTime(new Date())
}

export const isOperativeOverTime = (date) => {
  const startOfOperativeDay = new Date(date).setHours(8, 0, 0)
  const endOfOperativeDay = new Date(date).setHours(16, 0, 0)

  if (isNonWorkingDay(date)) {
    return true
  } else {
    return !isWithinInterval(date, {
      start: startOfOperativeDay,
      end: endOfOperativeDay,
    })
  }
}

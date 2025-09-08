import { isWeekend, format, getHours, isWithinInterval } from 'date-fns'
import { bankHolidays } from './bankHolidays'

const WORKDAY_START_HOUR = 8
const WORKDAY_END_HOUR = 18

const isBankHoliday = (date: Date) => {
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
  }

  if (getHours(now) < WORKDAY_START_HOUR || getHours(now) >= WORKDAY_END_HOUR) {
    return true
  }

  return false
}

const isNonWorkingDay = (date: Date) => {
  return isWeekend(date) || isBankHoliday(date)
}

export const isCurrentTimeOperativeOvertime = () => {
  if (typeof window.Cypress != 'undefined' && window.Cypress) {
    if (typeof window.Cypress.env('IsCurrentOperativeOvertime') == 'boolean') {
      return window.Cypress.env('IsCurrentOperativeOvertime')
    }

    return false
  }

  const date = new Date()

  const startOfOperativeDay = new Date(date).setHours(8, 0, 0)
  const endOfOperativeDay = new Date(date).setHours(16, 0, 0)

  if (isNonWorkingDay(date)) {
    return true
  }

  return !isWithinInterval(date, {
    start: startOfOperativeDay,
    end: endOfOperativeDay,
  })
}

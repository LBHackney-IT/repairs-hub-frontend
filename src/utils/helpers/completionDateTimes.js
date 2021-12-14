import { priorityCodeCompletionTimes } from '../hact/helpers/priorityCodes'
import {
  isSaturday,
  addDays,
  subDays,
  isWeekend,
  format,
  getHours,
  isWithinInterval,
} from 'date-fns'
import { bankHolidays } from './bankHolidays'

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

export const isNonWorkingDay = (date) => isWeekend(date) || isBankHoliday(date)

// Returns supplied start date plus however many calendar days we loop over to satisfy
// the required number of working days.
const dateAfterCountWorkingDays = (startDate, targetWorkingDaysCount) => {
  let workingDaysCount = 0
  let calendarDaysCount = 0

  while (workingDaysCount < targetWorkingDaysCount) {
    calendarDaysCount += 1

    const date = addDays(startDate, calendarDaysCount)

    if (!isNonWorkingDay(date)) {
      workingDaysCount += 1
    }
  }

  return addDays(startDate, calendarDaysCount)
}

export const calculateCompletionDateTime = (priorityCode) => {
  const {
    numberOfHours: completionTargetHours,
    numberOfDays: completionTargetWorkingDays,
  } = priorityCodeCompletionTimes[priorityCode]

  let now = new Date()

  if (
    // Immediates always have a target of 2 hours
    completionTargetWorkingDays < 1
  ) {
    return new Date(now.setHours(now.getHours() + completionTargetHours))
  } else {
    // For the purpose of target time calculation, treat an order raised on a Saturday
    // as if it had been raised on the preceding Friday.
    if (isSaturday(now)) {
      now = subDays(now, 1)
    }

    return dateAfterCountWorkingDays(now, completionTargetWorkingDays)
  }
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

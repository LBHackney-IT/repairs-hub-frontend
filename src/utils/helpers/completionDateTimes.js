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
import { lowPriorityHolidays } from './lowPriorityHolidays'
import { LOW_PRIORITY_CODES } from './priorities'

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

// Returns supplied start date plus however many calendar days we loop over to satisfy
// the required number of working days.
const dateAfterCountWorkingDays = ({
  startDate,
  targetWorkingDaysCount,
  lowPriority,
}) => {
  let workingDaysCount = 0
  let calendarDaysCount = 0

  while (workingDaysCount < targetWorkingDaysCount) {
    calendarDaysCount += 1

    const date = addDays(startDate, calendarDaysCount)

    if (!isNonWorkingDay(date, lowPriority)) {
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

    return dateAfterCountWorkingDays({
      startDate: now,
      targetWorkingDaysCount: completionTargetWorkingDays,
      lowPriority: LOW_PRIORITY_CODES.includes(priorityCode),
    })
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

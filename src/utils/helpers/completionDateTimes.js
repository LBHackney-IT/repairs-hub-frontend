import { priorityCodeCompletionTimes } from '../hact/helpers/priority-codes'
import { isSaturday, addDays, subDays, isWeekend } from 'date-fns'

const isWorkingDay = (date) => !isWeekend(date)

// Returns supplied start date plus however many calendar days we loop over to satisfy
// the required number of working days.
const dateAfterCountWorkingDays = (startDate, targetWorkingDaysCount) => {
  let workingDaysCount = 0
  let calendarDaysCount = 0

  while (workingDaysCount < targetWorkingDaysCount) {
    calendarDaysCount += 1

    const date = addDays(startDate, calendarDaysCount)

    if (isWorkingDay(date)) {
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

import { priorityCodeCompletionTimes } from '../hact/helpers/priority-codes'
import add from 'date-fns/add'

const WEEKEND_DAYS = [0, 6]

const isWorkingDay = (date) => !WEEKEND_DAYS.includes(date.getDay())

const dateAfterCountWorkingDays = (startDate, targetWorkingDaysCount) => {
  var workingDaysCount = 0
  var calendarDaysCount = 0

  while (workingDaysCount < targetWorkingDaysCount) {
    calendarDaysCount += 1

    const date = add(startDate, { days: calendarDaysCount })

    if (isWorkingDay(date)) {
      workingDaysCount += 1
    }
  }

  // Return the start date plus however many calendar days we looped over to satisfy
  // the required number of working days.
  return add(startDate, { days: calendarDaysCount })
}

export const calculateCompletionDateTime = (priorityCode) => {
  const {
    numberOfHours: completionTargetHours,
    numberOfDays: completionTargetWorkingDays,
  } = priorityCodeCompletionTimes[priorityCode]

  const now = new Date()

  if (completionTargetWorkingDays < 1) {
    return new Date(now.setHours(now.getHours() + completionTargetHours))
  } else {
    return dateAfterCountWorkingDays(now, completionTargetWorkingDays)
  }
}

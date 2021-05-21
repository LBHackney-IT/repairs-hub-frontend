import { priorityCodeCompletionTimes } from '../hact/helpers/priority-codes'
import { isSaturday, addDays, subDays, isWeekend, format } from 'date-fns'

export class PriorityCodeError extends Error {
  constructor(message) {
    super(message)
  }
}

export class CompletionTimesCalculator {
  constructor(priorityCode, bankHolidays = []) {
    this.bankHolidays = bankHolidays

    if (!priorityCodeCompletionTimes[priorityCode]) {
      throw new PriorityCodeError(`Invalid priority code ${priorityCode}`)
    }

    const {
      numberOfHours: completionTargetHours,
      numberOfDays: completionTargetWorkingDays,
    } = priorityCodeCompletionTimes[priorityCode]

    this.completionTargetHours = completionTargetHours
    this.completionTargetWorkingDays = completionTargetWorkingDays
  }

  completionDateTime() {
    let now = new Date()

    if (
      // Immediates always have a target of 2 hours
      this.completionTargetWorkingDays < 1
    ) {
      return new Date(now.setHours(now.getHours() + this.completionTargetHours))
    } else {
      // For the purpose of target time calculation, treat an order raised on a Saturday
      // as if it had been raised on the preceding Friday.
      if (isSaturday(now)) {
        now = subDays(now, 1)
      }

      return this.dateAfterCountWorkingDays(
        now,
        this.completionTargetWorkingDays
      )
    }
  }

  // Returns supplied start date plus however many calendar days we loop over to satisfy
  // the required number of working days.
  dateAfterCountWorkingDays(startDate, targetWorkingDaysCount) {
    let workingDaysCount = 0
    let calendarDaysCount = 0

    while (workingDaysCount < targetWorkingDaysCount) {
      calendarDaysCount += 1

      const date = addDays(startDate, calendarDaysCount)

      if (!this.isNonWorkingDay(date)) {
        workingDaysCount += 1
      }
    }

    return addDays(startDate, calendarDaysCount)
  }

  isNonWorkingDay(date) {
    return isWeekend(date) || this.isBankHoliday(date)
  }

  isBankHoliday(date) {
    const formattedDate = format(date, 'yyyy-MM-dd')

    return this.bankHolidays.some(
      (bankHoliday) => formattedDate === bankHoliday.date
    )
  }
}

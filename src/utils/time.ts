const DAY = 86400000

export const extractTimeFromDate = (datetime: Date | string): string => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }
  return datetime.toLocaleString('en-GB', {
    hourCycle: 'h23',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatDateTime = (datetime: Date | string): string => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }

  const options: Intl.DateTimeFormatOptions = {
    hourCycle: 'h23',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }

  if (process.env.NODE_ENV === 'test') {
    options.timeZone = 'UTC'
  }

  // EG. 21 Aug 2024, 13:21
  return datetime.toLocaleString('en-GB', options)
}

export const beginningOfDay = (date: Date): Date => {
  return new Date(Math.floor(date.getTime() / DAY) * DAY)
}

export const beginningOfWeek = (date: Date): Date => {
  const offset = ((date.getDay() + 6) % 7) * DAY
  return beginningOfDay(new Date(date.getTime() - offset))
}

export const daysAfter = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * DAY)
}

export const getWorkingDaysBeforeDate = (
  date: Date,
  numberOfDays: number
): Date[] => {
  const daysCountdown: Date[] = Array(numberOfDays).fill('')
  daysCountdown.forEach((_, index) => {
    daysCountdown[index] = new Date(date.getTime() - numberOfDays * DAY)
    numberOfDays -= 1
  })

  const removeWeekends = daysCountdown.filter(
    (date) =>
      date.toString().slice(0, 3) !== 'Sat' &&
      date.toString().slice(0, 3) !== 'Sun'
  )
  return removeWeekends.reverse()
}

export const dateEqual = (date: Date, otherDate: Date): boolean => {
  return date.getTime() === otherDate.getTime()
}

export const daysInHours = (days?: number): number =>
  !days || days < 1 ? 0 : days * 24

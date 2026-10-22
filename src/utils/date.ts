// TODO: return type is `any` because callers store the result in string state
export const convertDate = (dateAsString?: string): any => {
  if (dateAsString) {
    return new Date(dateAsString)
  }
  return dateAsString
}
export const dateToStr = (date: Date | string | number): string =>
  new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

export const sortObjectsByDateKey = (
  objects: Record<string, any>[],
  dateFields: string[],
  dateKeyToSortBy: string
) => {
  objects.forEach((o) => {
    dateFields.forEach((field) => {
      o[field] = convertDate(o[field])
    })
  })

  return objects.sort((a, b) => b[dateKeyToSortBy] - a[dateKeyToSortBy])
}

export const convertFormat = (date: string): string => {
  const values = date.split('-')
  return `${values[0]}-${values[1]}-${values[2]}`
}

export const convertToDateFormat = (
  dateString: string,
  timeString: string
): any => {
  const dateAsString = `${dateString}T${timeString}`
  return convertDate(dateAsString)
}

export const shortDayName = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

export const shortDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const monthDay = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { day: 'numeric' })
}

export const shortMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { month: 'short' })
}

export const longMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { month: 'long' })
}

export const isBeginningOfMonth = (date: Date): boolean => {
  return date.getDate() === 1
}

export const toISODate = (date: Date): string => {
  return date.toISOString().substring(0, 10)
}

export function longMonthWeekday(
  date?: Date | string | number,
  { commaSeparated = true } = {}
): string | undefined {
  if (date) {
    return commaSeparated === true
      ? new Date(date).toLocaleDateString('en-GB', {
          month: 'long',
          weekday: 'long',
          day: 'numeric',
        })
      : [
          new Date(date).toLocaleDateString('en-GB', {
            weekday: 'long',
          }),
          new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          }),
        ].join(' ')
  }
}

export const longDateToStr = (date: Date | string | number): string =>
  new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const getYesterdayDate = (currentDate: Date): number => {
  const yesterday = new Date()
  return yesterday.setDate(currentDate.getDate() - 1)
}

import { format } from 'date-fns'
import { beginningOfDay } from './time'

export const convertDate = (dateAsString) => {
  if (dateAsString) {
    return new Date(dateAsString)
  }
  return dateAsString
}
export const dateToStr = (date) =>
  new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

export const sortObjectsByDateKey = (objects, dateFields, dateKeyToSortBy) => {
  objects.forEach((o) => {
    dateFields.forEach((field) => {
      o[field] = convertDate(o[field])
    })
  })

  return objects.sort((a, b) => b[dateKeyToSortBy] - a[dateKeyToSortBy])
}

export const convertFormat = (date) => {
  const values = date.split('-')
  return `${values[0]}-${values[1]}-${values[2]}`
}

export const convertToDateFormat = (dateString, timeString) => {
  const dateAsString = `${dateString}T${timeString}`
  return convertDate(dateAsString)
}

export const shortDayName = (date) => {
  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

export const shortDate = (date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const monthDay = (date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric' })
}

export const shortMonthName = (date) => {
  return date.toLocaleDateString('en-GB', { month: 'short' })
}

export const longMonthName = (date) => {
  return date.toLocaleDateString('en-GB', { month: 'long' })
}

export const isBeginningOfMonth = (date) => {
  return date.getDate() === 1
}

export const toISODate = (date) => {
  return date.toISOString().substring(0, 10)
}

export function longMonthWeekday(date, { commaSeparated = true } = {}) {
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

export const longDateToStr = (date) =>
  new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const getYesterdayDate = (currentDate) => {
  const yesterday = new Date()
  return yesterday.setDate(currentDate.getDate() - 1)
}

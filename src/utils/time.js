const DAY = 86400000

export const extractTimeFromDate = (datetime) => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }
  return datetime.toLocaleString('en-GB', {
    hourCycle: 'h23',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatDateTime = (datetime) => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }
  return datetime.toLocaleString('en-GB', {
    hourCycle: 'h23',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const beginningOfDay = (date) => {
  return new Date(Math.floor(date.getTime() / DAY) * DAY)
}

export const beginningOfWeek = (date) => {
  const offset = ((date.getDay() + 6) % 7) * DAY
  return beginningOfDay(new Date(date.getTime() - offset))
}

export const daysAfter = (date, days) => {
  return new Date(date.getTime() + days * DAY)
}

export const dateEqual = (date, otherDate) => {
  return date.getTime() === otherDate.getTime()
}

export const daysInHours = (days) => (!days || days < 1 ? 0 : days * 24)

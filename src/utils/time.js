export const extractTimeFromDate = (date) =>
  date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12',
  })

export const formatDateTime = (datetime) => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }
  return datetime.toLocaleString('en-GB', {
    hourCycle: 'h12',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

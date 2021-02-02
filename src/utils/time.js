export const extractTimeFromDate = (date) =>
  date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

export const formatDateTime = (datetime) => {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime)
  }
  return datetime.toLocaleString('en-GB', {
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

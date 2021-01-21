export const extractTimeFromDate = (date) =>
  date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

export const convertDate = (dateAsString) => {
  if (dateAsString) {
    return new Date(dateAsString)
  }
  return dateAsString
}
export const dateToStr = (date) =>
  date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const sortedByDate = (data) => {
  data.forEach((job) => {
    job.dateRaised = convertDate(job.dateRaised)
    job.lastUpdated = convertDate(job.lastUpdated)
  })

  return data.sort((a, b) => b.dateRaised - a.dateRaised)
}

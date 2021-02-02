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

export const convertFormat = (date) => {
  const values = date.split('-')
  return `${values[0]}-${values[1]}-${values[2]}`
}

export const convertToDateFormat = (string) => {
  const dateAsString = `${string.date}T${string.time}`
  return convertDate(dateAsString)
}

export const sortedByDateAdded = (data) => {
  data.forEach((job) => (job.dateAdded = convertDate(job.dateAdded)))

  return data.sort((a, b) => b.dateAdded - a.dateAdded)
}

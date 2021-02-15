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

export const convertToDateFormat = (string) => {
  const dateAsString = `${string.date}T${string.time}`
  return convertDate(dateAsString)
}

export const calculateNewDateTimeFromDate = (date, hours) => {
  if (!hours) {
    console.error('No argument given, hours must be supplied')
    return null
  }

  // let currentDateTime = new Date()
  return new Date(date.getTime() + hours * 3600000)
}

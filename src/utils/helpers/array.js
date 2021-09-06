export const uniqueArrayValues = (array) => {
  const set = new Set(array)
  return [...set]
}

export const sortArrayByDate = (array, dateAttribute) => {
  return array.sort(function (a, b) {
    return new Date(b[dateAttribute]) - new Date(a[dateAttribute])
  })
}

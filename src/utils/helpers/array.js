export const uniqueArrayValues = (array) => {
  const set = new Set(array)
  return [...set]
}

export const sortArrayByDate = (array, dateAttribute) => {
  return array.sort(function (a, b) {
    return new Date(b[dateAttribute]) - new Date(a[dateAttribute])
  })
}

export const convertValuesOfObjectToArray = (object, noNeedToConvert = []) => {
  const newObject = Object.assign({}, object)
  for (let [key, value] of Object.entries(newObject)) {
    if (noNeedToConvert.includes(key)) continue

    if (!Array.isArray(value)) {
      newObject[key] = [value]
    }
  }
  return newObject
}

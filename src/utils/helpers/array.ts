export const uniqueArrayValues = <T>(array: Iterable<T>): T[] => {
  const set = new Set(array)
  return [...set]
}

// Sorts in place, newest first
export const sortArrayByDate = <T extends Record<string, any>>(
  array: T[],
  dateAttribute: string
): T[] => {
  return array.sort(function (a, b) {
    return (
      new Date(b[dateAttribute]).getTime() -
      new Date(a[dateAttribute]).getTime()
    )
  })
}

export const convertValuesOfObjectToArray = (
  object: Record<string, any>,
  noNeedToConvert: string[] = []
): Record<string, any[]> => {
  const newObject = Object.assign({}, object)
  for (const [key, value] of Object.entries(newObject)) {
    if (noNeedToConvert.includes(key)) continue

    if (!Array.isArray(value)) {
      newObject[key] = [value]
    }
  }
  return newObject
}

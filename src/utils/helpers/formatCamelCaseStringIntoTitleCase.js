export const formatCamelCaseStringIntoTitleCase = (str) => {
  // Step 1 & 2: Add a space before each capital letter and lowercase the entire string
  str = str.replace(/([A-Z])/g, ' $1').toLowerCase()

  // Step 3: Capitalize the first letter of each word
  return str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}

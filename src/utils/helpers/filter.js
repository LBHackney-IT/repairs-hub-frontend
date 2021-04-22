export const setFilterOptions = (formData) => {
  let filterOptions = {}

  Object.keys(formData).forEach((filterCategory) => {
    let filterCategoryObject = formData[filterCategory]
    let filterCategoryObjectKeys = Object.keys(filterCategoryObject)

    filterCategoryObjectKeys.forEach((key) => {
      if (filterCategoryObject[key]) {
        if (!filterOptions[filterCategory]) {
          filterOptions[filterCategory] = []
        }

        filterOptions[filterCategory].push(key)
      }
    })
  })

  return filterOptions
}

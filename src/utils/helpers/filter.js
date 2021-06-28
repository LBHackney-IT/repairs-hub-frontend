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

const keyToDescriptionMap = (filters) => {
  let filterMap = {}

  Object.keys(filters).forEach((filterCategory) => {
    let filterCategoryObject = filters[filterCategory]

    const keyToDescriptionMapping = filterCategoryObject.map((object) => {
      return {
        [object.key]: object.description,
      }
    })

    Object.assign(filterMap, {
      [filterCategory]: Object.assign(...keyToDescriptionMapping),
    })
  })

  return filterMap
}

export class SelectedFilterOptions {
  constructor(appliedFilters, filters) {
    this.keyToDescriptionMap = keyToDescriptionMap(filters)
    this.selectedContractors = appliedFilters.ContractorReference
    this.selectedStatuses = appliedFilters.StatusCode
    this.selectedPriorities = appliedFilters.Priorities
    this.selectedTrades = appliedFilters.TradeCodes
  }

  getSelectedFilterOptions() {
    return {
      ...(this.selectedContractors && { Contractor: this.getContractors() }),
      ...(this.selectedStatuses && { Status: this.getStatuses() }),
      ...(this.selectedPriorities && { Priority: this.getPriorities() }),
      ...(this.selectedTrades && { Trade: this.getTrades() }),
    }
  }

  getContractors() {
    return (this.selectedContractors && [this.selectedContractors].flat()).map(
      (contractor) => {
        return this.keyToDescriptionMap.Contractors[contractor]
      }
    )
  }

  getStatuses() {
    return (this.selectedStatuses && [this.selectedStatuses].flat()).map(
      (status) => {
        return this.keyToDescriptionMap.Status[status]
      }
    )
  }

  getPriorities() {
    return (this.selectedPriorities && [this.selectedPriorities].flat()).map(
      (priority) => {
        return this.keyToDescriptionMap.Priority[priority]
      }
    )
  }

  getTrades() {
    return (this.selectedTrades && [this.selectedTrades].flat()).map(
      (trade) => {
        return this.keyToDescriptionMap.Trades[trade]
      }
    )
  }
}

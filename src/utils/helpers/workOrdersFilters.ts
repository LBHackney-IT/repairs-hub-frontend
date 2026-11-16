type Filters = Record<string, any>

// The filter categories the work orders list understands, keyed by the
// description used for them in the selected filter tags
const FILTER_KEY_BY_CATEGORY: Record<string, string> = {
  contractor: 'ContractorReference',
  priority: 'Priorities',
  status: 'StatusCode',
  trade: 'TradeCodes',
}

const FILTER_KEYS = Object.values(FILTER_KEY_BY_CATEGORY)

// Keeps only the filter values, dropping anything else (pageNumber etc.)
export const pickFilters = (filters: Filters = {}): Filters =>
  Object.fromEntries(
    FILTER_KEYS.filter((key) => filters[key]).map((key) => [key, filters[key]])
  )

// Removes one value from a category (and the category itself once it is empty),
// without changing the filters passed in
export const removeFilter = (
  filters: Filters,
  category: string,
  index: number
): Filters => {
  const picked = pickFilters(filters)
  const key = FILTER_KEY_BY_CATEGORY[category.toLowerCase()]

  if (!picked[key]) return picked

  const values = Array.isArray(picked[key]) ? picked[key] : [picked[key]]

  const others = { ...picked }
  delete others[key]
  const remaining = values.filter((_, i) => i !== index)

  // A category with nothing left in it is no longer a filter
  return remaining.length > 0 ? { ...others, [key]: remaining } : others
}

export const WORK_ORDERS_MANAGEMENT_PAGE_SIZE = 10

// Params for the work orders API request
export const buildWorkOrdersParams = (
  filters: Filters = {},
  pageNumber: number
): Filters => ({
  PageSize: WORK_ORDERS_MANAGEMENT_PAGE_SIZE,
  PageNumber: pageNumber,
  ...pickFilters(filters),
  IncludeHistorical: false,
})

// Query string for the home page URL
export const buildUrlQuery = (
  filters: Filters = {},
  pageNumber = 1
): Filters => ({
  pageNumber,
  ...pickFilters(filters),
})

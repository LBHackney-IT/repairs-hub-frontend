import {
  pickFilters,
  removeFilter,
  buildWorkOrdersParams,
  buildUrlQuery,
} from './workOrdersFilters'

describe('pickFilters', () => {
  it('keeps the status, priority, trade and contractor filters', () => {
    const filters = {
      StatusCode: ['80'],
      Priorities: ['1'],
      TradeCodes: ['EL'],
      ContractorReference: ['PUR'],
    }

    expect(pickFilters(filters)).toEqual(filters)
  })

  it('keeps the filters in a fixed order, whatever order they were given in', () => {
    expect(
      Object.keys(
        pickFilters({
          ContractorReference: ['PUR'],
          TradeCodes: ['EL'],
          Priorities: ['1'],
          StatusCode: ['80'],
        })
      )
    ).toEqual(['StatusCode', 'Priorities', 'TradeCodes', 'ContractorReference'])
  })

  it('drops values that are not filters', () => {
    expect(
      pickFilters({
        pageNumber: '2',
        IncludeHistorical: false,
        StatusCode: ['80'],
      })
    ).toEqual({ StatusCode: ['80'] })
  })

  it('drops filters with no value', () => {
    expect(pickFilters({ StatusCode: undefined, Priorities: '' })).toEqual({})
  })

  it('returns an empty object when there are no filters', () => {
    expect(pickFilters(undefined)).toEqual({})
    expect(pickFilters({})).toEqual({})
  })
})

describe('removeFilter', () => {
  const filters = {
    StatusCode: ['80', '90', '30'],
    Priorities: ['1', '2'],
    TradeCodes: ['EL', 'PL'],
    ContractorReference: ['PUR', 'AVP'],
  }

  it.each([
    ['first', 0, ['90', '30']],
    ['middle', 1, ['80', '30']],
    ['last', 2, ['80', '90']],
  ])('removes the %s value from a category', (_, index, expected) => {
    expect(removeFilter(filters, 'status', index).StatusCode).toEqual(expected)
  })

  it.each([
    ['contractor', 'ContractorReference', ['AVP']],
    ['priority', 'Priorities', ['2']],
    ['status', 'StatusCode', ['90', '30']],
    ['trade', 'TradeCodes', ['PL']],
  ])('removes from the %s category', (category, key, expected) => {
    expect(removeFilter(filters, category, 0)[key]).toEqual(expected)
  })

  it('matches the category regardless of case', () => {
    expect(removeFilter(filters, 'Status', 0).StatusCode).toEqual(['90', '30'])
  })

  it('leaves the other categories untouched', () => {
    expect(removeFilter(filters, 'status', 0)).toEqual({
      ...filters,
      StatusCode: ['90', '30'],
    })
  })

  it('removes the category when its last value is removed', () => {
    expect(
      removeFilter({ StatusCode: ['80'], Priorities: ['1'] }, 'status', 0)
    ).toEqual({ Priorities: ['1'] })
  })

  it('handles a category holding a single value rather than a list', () => {
    expect(
      removeFilter({ StatusCode: '80', Priorities: '1' }, 'status', 0)
    ).toEqual({ Priorities: '1' })
  })

  it('drops values that are not filters', () => {
    expect(
      removeFilter({ pageNumber: '2', StatusCode: ['80', '90'] }, 'status', 0)
    ).toEqual({ StatusCode: ['90'] })
  })

  it('changes nothing when the category is unknown or not applied', () => {
    expect(removeFilter(filters, 'unknown', 0)).toEqual(filters)
    expect(removeFilter({ StatusCode: ['80'] }, 'trade', 0)).toEqual({
      StatusCode: ['80'],
    })
  })

  it('does not change the filters passed in', () => {
    const original = { StatusCode: ['80', '90'] }

    removeFilter(original, 'status', 0)

    expect(original).toEqual({ StatusCode: ['80', '90'] })
  })
})

describe('buildWorkOrdersParams', () => {
  it('asks for a page of 10 with no historical work orders when there are no filters', () => {
    expect(buildWorkOrdersParams({}, 1)).toEqual({
      PageSize: 10,
      PageNumber: 1,
      IncludeHistorical: false,
    })
  })

  it('uses the page number given', () => {
    expect(buildWorkOrdersParams({}, 4).PageNumber).toBe(4)
  })

  it('includes each type of filter', () => {
    expect(
      buildWorkOrdersParams(
        {
          StatusCode: ['80', '90'],
          Priorities: ['1'],
          TradeCodes: ['EL'],
          ContractorReference: ['PUR'],
        },
        1
      )
    ).toEqual({
      PageSize: 10,
      PageNumber: 1,
      StatusCode: ['80', '90'],
      Priorities: ['1'],
      TradeCodes: ['EL'],
      ContractorReference: ['PUR'],
      IncludeHistorical: false,
    })
  })

  it('passes a single filter value through as it is', () => {
    expect(buildWorkOrdersParams({ StatusCode: '80' }, 1).StatusCode).toBe('80')
  })

  it('ignores the page number held in the filters', () => {
    expect(buildWorkOrdersParams({ pageNumber: '5' }, 2).PageNumber).toBe(2)
  })

  it('handles missing filters', () => {
    expect(buildWorkOrdersParams(undefined, 1)).toEqual({
      PageSize: 10,
      PageNumber: 1,
      IncludeHistorical: false,
    })
  })
})

describe('buildUrlQuery', () => {
  it('starts at page 1 by default', () => {
    expect(buildUrlQuery({ StatusCode: ['80'] })).toEqual({
      pageNumber: 1,
      StatusCode: ['80'],
    })
  })

  it('uses the page number given', () => {
    expect(buildUrlQuery({}, 3)).toEqual({ pageNumber: 3 })
  })

  it('includes each type of filter', () => {
    const filters = {
      StatusCode: ['80'],
      Priorities: ['1'],
      TradeCodes: ['EL'],
      ContractorReference: ['PUR'],
    }

    expect(buildUrlQuery(filters, 2)).toEqual({ pageNumber: 2, ...filters })
  })

  it('drops filters with no value and values that are not filters', () => {
    expect(
      buildUrlQuery(
        { pageNumber: '9', IncludeHistorical: false, StatusCode: undefined },
        2
      )
    ).toEqual({ pageNumber: 2 })
  })

  it('handles missing filters', () => {
    expect(buildUrlQuery(undefined)).toEqual({ pageNumber: 1 })
  })
})

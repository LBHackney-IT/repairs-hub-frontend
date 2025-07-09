import {
  ninthOfJulyTwentyTwentyFive,
  mockContracts,
  mockInactiveContracts,
} from './mockContractsData'
import {
  monthsOffset,
  filterContractsByExpiryDate,
  filterRelativeInactiveContracts,
  filterRelevantContracts,
  mapContractorNamesAndReferences,
  sortContractorNamesAndReferencesByContractorName,
} from './utils'

describe('filter contracts by expiry date', () => {
  it('returns contracts that will expire in the next two months', () => {
    const contracts = mockContracts

    const response = filterContractsByExpiryDate(
      contracts,
      2,
      ninthOfJulyTwentyTwentyFive
    )

    expect(response).toStrictEqual([
      {
        contractReference: '126-126-1266',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-03-26T00:00:00Z',
        contractorReference: 'AIM',
        contractorName: 'Aim Windows',
        isRaisable: true,
        sorCount: 118,
        sorCost: 52080.57,
      },
      {
        contractReference: '127-127-1277',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2023-09-15T23:00:00Z',
        contractorReference: 'SCC',
        contractorName: 'Alphatrack (S) Systems Lt',
        isRaisable: true,
        sorCount: 0,
        sorCost: 0,
      },
    ])
  })
})

describe('relativeInactiveContracts', () => {
  it('should return all inactive contracts that expire after 2020', () => {
    const inactiveContracts = mockInactiveContracts
    const response = filterRelativeInactiveContracts(inactiveContracts, '2020')

    expect(response).toStrictEqual([
      {
        contractReference: '133-133-1388',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '144-144-1444',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '155-155-1555',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
    ])
  })
})

describe('filterRelevantContracts', () => {
  it('returns a filtered array of contracts that expire after a certain date', () => {
    const contracts = mockContracts

    const response = filterRelevantContracts(contracts, '2020')

    expect(response).toStrictEqual([
      {
        contractReference: '133-133-1388',
        terminationDate: '2021-03-31T00:00:00Z',
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '113-113-1133',
        terminationDate: '2021-03-31T00:00:00Z',
        effectiveDate: '2023-04-01T00:00:00Z',
        contractorReference: 'HHL',
        contractorName: 'Herts Heritage Ltd',
        isRaisable: true,
        sorCount: 1608,
        sorCost: 216748.91,
      },
      {
        contractReference: '114-114-1144',
        terminationDate: '2021-03-31T00:00:00Z',
        effectiveDate: '2023-04-01T00:00:00Z',
        contractorReference: 'AEP',
        contractorName: 'Axis Europe (X) PLC',
        isRaisable: true,
        sorCount: 87,
        sorCost: 25331.17,
      },
      {
        contractReference: '115-115-1155',
        terminationDate: '2024-03-31T00:00:00Z',
        effectiveDate: '2023-04-01T00:00:00Z',
        contractorReference: 'AEP',
        contractorName: 'Axis Europe (X) PLC',
        isRaisable: true,
        sorCount: 950,
        sorCost: 49404.2,
      },
      {
        contractReference: '116-116-1166',
        terminationDate: '2024-03-31T00:00:00Z',
        effectiveDate: '2023-04-01T00:00:00Z',
        contractorReference: 'AEP',
        contractorName: 'Axis Europe (X) PLC',
        isRaisable: true,
        sorCount: 233,
        sorCost: 411990.86,
      },
      {
        contractReference: '117-117-1177',
        terminationDate: '2024-03-31T00:00:00Z',
        effectiveDate: '2023-04-01T00:00:00Z',
        contractorReference: 'AEP',
        contractorName: 'Axis Europe (X) PLC',
        isRaisable: true,
        sorCount: 292,
        sorCost: 75523.29,
      },
      {
        contractReference: '118-118-1188',
        terminationDate: '2024-03-31T23:00:00Z',
        effectiveDate: '2023-03-01T23:00:00Z',
        contractorReference: 'HHL',
        contractorName: 'Herts Heritage Ltd',
        isRaisable: true,
        sorCount: 634,
        sorCost: 169344.46,
      },
      {
        contractReference: '119-119-1199',
        terminationDate: '2024-09-01T00:00:00Z',
        effectiveDate: '2023-09-01T00:00:00Z',
        contractorReference: 'AVP',
        contractorName: 'Avonline Network (A) Ltd',
        isRaisable: true,
        sorCount: 107,
        sorCost: 10237.7,
      },
      {
        contractReference: '120-120-1200',
        terminationDate: '2024-09-19T00:00:00Z',
        effectiveDate: '2023-09-20T00:00:00Z',
        contractorReference: 'FPM',
        contractorName: 'Foster Property Maintenance Ltd',
        isRaisable: true,
        sorCount: 2656,
        sorCost: 418873.31,
      },
      {
        contractReference: '121-121-1211',
        terminationDate: '2024-09-19T00:00:00Z',
        effectiveDate: '2023-09-20T00:00:00Z',
        contractorReference: 'FPM',
        contractorName: 'Foster Property Maintenance Ltd',
        isRaisable: true,
        sorCount: 2657,
        sorCost: 439826.98,
      },
      {
        contractReference: '122-122-1222',
        terminationDate: '2024-10-31T00:00:00Z',
        effectiveDate: '2024-05-09T00:00:00Z',
        contractorReference: 'JBC',
        contractorName: 'John Bold & Co LIMITED',
        isRaisable: true,
        sorCount: 55,
        sorCost: 4292.64,
      },
      {
        contractReference: '123-123-1233',
        terminationDate: '2025-01-31T00:00:00Z',
        effectiveDate: '2024-05-27T00:00:00Z',
        contractorReference: 'APL',
        contractorName: 'Apex Lifts',
        isRaisable: true,
        sorCount: 105,
        sorCost: 92211.87,
      },
      {
        contractReference: '124-124-1244',
        terminationDate: '2025-01-31T00:00:00Z',
        effectiveDate: '2024-05-28T00:00:00Z',
        contractorReference: 'TSL',
        contractorName: 'Top Services Ltd',
        isRaisable: true,
        sorCount: 71,
        sorCost: 13602,
      },
      {
        contractReference: '125-125-1255',
        terminationDate: '2025-02-28T00:00:00Z',
        effectiveDate: '2024-05-08T00:00:00Z',
        contractorReference: 'SFE',
        contractorName: 'Sureserve Fire & Electrical',
        isRaisable: true,
        sorCount: 32,
        sorCost: 3321.79,
      },
      {
        contractReference: '126-126-1266',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-03-26T00:00:00Z',
        contractorReference: 'AIM',
        contractorName: 'Aim Windows',
        isRaisable: true,
        sorCount: 118,
        sorCost: 52080.57,
      },
      {
        contractReference: '127-127-1277',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2023-09-15T23:00:00Z',
        contractorReference: 'SCC',
        contractorName: 'Alphatrack (S) Systems Lt',
        isRaisable: true,
        sorCount: 0,
        sorCost: 0,
      },
      {
        contractReference: '128-128-1288',
        terminationDate: monthsOffset(
          6,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 34,
        sorCost: 5958.38,
      },
      {
        contractReference: '129-129-1299',
        terminationDate: monthsOffset(
          6,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-08-01T00:00:00Z',
        contractorReference: 'WIG',
        contractorName: 'THE WIGGETT GROUP LTD',
        isRaisable: true,
        sorCount: 3441,
        sorCost: 544898.23,
      },
      {
        contractReference: '130-130-1300',
        terminationDate: monthsOffset(
          6,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-08-01T00:00:00Z',
        contractorReference: 'WIG',
        contractorName: 'THE WIGGETT GROUP LTD',
        isRaisable: true,
        sorCount: 3443,
        sorCost: 573623.97,
      },
      {
        contractReference: '131-131-1311',
        terminationDate: monthsOffset(
          6,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2022-09-18T23:00:00Z',
        contractorReference: 'H01',
        contractorName: 'HH General Building Repai',
        isRaisable: true,
        sorCount: 904,
        sorCost: 143393.57,
      },
      {
        contractReference: '132-132-1322',
        terminationDate: monthsOffset(
          6,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-03-26T00:00:00Z',
        contractorReference: 'CJL',
        contractorName: 'Conrad Jacobs Ltd',
        isRaisable: true,
        sorCount: 2,
        sorCost: 56.74,
      },
    ])
  })
})

describe('mapContractorNamesAndReferences', () => {
  it('returns an array of objects each containing contractor name and contractor reference', () => {
    const relevantContracts = filterRelevantContracts(mockContracts, '2021')

    const contractorNames = new Set(
      relevantContracts.map((contract) => contract.contractorName)
    )

    const contractorReferences = new Set(
      relevantContracts.map((contract) => contract.contractorReference)
    )

    const response = mapContractorNamesAndReferences(
      contractorNames,
      contractorReferences
    )

    expect(response).toStrictEqual([
      { contractorName: 'Sycous Limited', contractorReference: 'SYC' },
      { contractorName: 'Herts Heritage Ltd', contractorReference: 'HHL' },
      { contractorName: 'Axis Europe (X) PLC', contractorReference: 'AEP' },
      {
        contractorName: 'Avonline Network (A) Ltd',
        contractorReference: 'AVP',
      },
      {
        contractorName: 'Foster Property Maintenance Ltd',
        contractorReference: 'FPM',
      },
      {
        contractorName: 'John Bold & Co LIMITED',
        contractorReference: 'JBC',
      },
      { contractorName: 'Apex Lifts', contractorReference: 'APL' },
      { contractorName: 'Top Services Ltd', contractorReference: 'TSL' },
      {
        contractorName: 'Sureserve Fire & Electrical',
        contractorReference: 'SFE',
      },
      { contractorName: 'Aim Windows', contractorReference: 'AIM' },
      {
        contractorName: 'Alphatrack (S) Systems Lt',
        contractorReference: 'SCC',
      },
      {
        contractorName: 'THE WIGGETT GROUP LTD',
        contractorReference: 'WIG',
      },
      {
        contractorName: 'HH General Building Repai',
        contractorReference: 'H01',
      },
      { contractorName: 'Conrad Jacobs Ltd', contractorReference: 'CJL' },
    ])
  })
})

describe('sortContractorNamesAndReferencesByContractorName', () => {
  it('returns an array of objects sorted alphabetically by contractor name', () => {
    const relevantContracts = filterRelevantContracts(mockContracts, '2021')
    const contractorNames = new Set(
      relevantContracts.map((contract) => contract.contractorName)
    )

    const contractorReferences = new Set(
      relevantContracts.map((contract) => contract.contractorReference)
    )

    const contractorNamesAndReferences = mapContractorNamesAndReferences(
      contractorNames,
      contractorReferences
    )

    const response = sortContractorNamesAndReferencesByContractorName(
      contractorNamesAndReferences
    )

    expect(response).toStrictEqual([
      { contractorName: 'Aim Windows', contractorReference: 'AIM' },
      {
        contractorName: 'Alphatrack (S) Systems Lt',
        contractorReference: 'SCC',
      },
      { contractorName: 'Apex Lifts', contractorReference: 'APL' },
      {
        contractorName: 'Avonline Network (A) Ltd',
        contractorReference: 'AVP',
      },
      { contractorName: 'Axis Europe (X) PLC', contractorReference: 'AEP' },
      { contractorName: 'Conrad Jacobs Ltd', contractorReference: 'CJL' },
      {
        contractorName: 'Foster Property Maintenance Ltd',
        contractorReference: 'FPM',
      },
      { contractorName: 'Herts Heritage Ltd', contractorReference: 'HHL' },
      {
        contractorName: 'HH General Building Repai',
        contractorReference: 'H01',
      },
      {
        contractorName: 'John Bold & Co LIMITED',
        contractorReference: 'JBC',
      },
      {
        contractorName: 'Sureserve Fire & Electrical',
        contractorReference: 'SFE',
      },
      { contractorName: 'Sycous Limited', contractorReference: 'SYC' },
      {
        contractorName: 'THE WIGGETT GROUP LTD',
        contractorReference: 'WIG',
      },
      { contractorName: 'Top Services Ltd', contractorReference: 'TSL' },
    ])
  })
})

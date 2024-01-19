import { render } from '@testing-library/react'
import DampAndMouldReportTable from './DampAndMouldReportTable'

const apiResponse = {
  results: [
    {
      id: 14,
      propertyReference: '12345678',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: true,
      previousReportResolved: false,
      comments: 'Hello there',
      reportedAt: '2024-01-18T12:15:56.020201Z',
      numberOfRecentReportsForProperty: 1,
    },
    {
      id: 13,
      propertyReference: '00023390',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: null,
      previousReportResolved: false,
      comments: 'Hello there',
      reportedAt: '2024-01-18T10:34:12.760633Z',
      numberOfRecentReportsForProperty: 7,
    },
    {
      id: 12,
      propertyReference: '00023390',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: true,
      previousReportResolved: true,
      comments: 'Hello there',
      reportedAt: '2024-01-18T10:34:11.692389Z',
      numberOfRecentReportsForProperty: 7,
    },
    {
      id: 11,
      propertyReference: '00023390',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: true,
      previousReportResolved: false,
      comments: 'Hello there',
      reportedAt: '2024-01-18T10:34:10.686312Z',
      numberOfRecentReportsForProperty: 7,
    },
    {
      id: 10,
      propertyReference: '00023390',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: true,
      previousReportResolved: false,
      comments: 'Hello there',
      reportedAt: '2024-01-18T10:34:09.625084Z',
      numberOfRecentReportsForProperty: 7,
    },
    {
      id: 9,
      propertyReference: '00023390',
      address: '55 Other Street',
      dampAndMouldPresenceConfirmed: false,
      previouslyReported: true,
      previousReportResolved: false,
      comments: 'Hello there',
      reportedAt: '2024-01-18T10:34:08.640456Z',
      numberOfRecentReportsForProperty: 7,
    },
  ],
  pageNumber: 1,
  pageSize: 6,
  pageCount: 2,
  totalCount: 8,
}

describe('DampAndMouldReportTable component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(
      <DampAndMouldReportTable reports={apiResponse.results} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should should hide additional property info columns', async () => {
    const { asFragment } = render(
      <DampAndMouldReportTable
        reports={apiResponse.results}
        showAdditionalPropertyInfo={false}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})

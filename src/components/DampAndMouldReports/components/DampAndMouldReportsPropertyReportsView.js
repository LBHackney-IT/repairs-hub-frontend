import { useEffect, useState } from 'react'
import { fetchReports } from '../fetchReports'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import DampAndMouldReportTable from './DampAndMouldReportTable'
import { Button } from '../../Form'

const DampAndMouldReportsPropertyReportsView = ({ propertyReference }) => {
  const pageSize = 6
  const [pageNumber, setPageNumber] = useState(1)

  const [reportsApiResponse, setReportsApiResponse] = useState(null)
  const [reports, setReports] = useState([])

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    fetchReports(pageNumber, pageSize, propertyReference)
      .then((reportsResponse) => {
        setReportsApiResponse(reportsResponse)

        setReports((existingReports) => [
          ...existingReports,
          ...reportsResponse.results,
        ])
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleShowMoreResults = () => {
    setIsLoading(true)

    const newPageNumner = pageNumber + 1

    setPageNumber((x) => x + 1)

    fetchReports(newPageNumner, pageSize, propertyReference)
      .then((res) => {
        setReports((existingReports) => [...existingReports, ...res.results])
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const isMorePages = reportsApiResponse?.pageCount > pageNumber ?? false

  return (
    <div className="govuk-body">
      {error && <ErrorMessage label={error} />}

      <p style={{ marginTop: '30px' }}>
        Showing {reports.length ?? 0} of {reportsApiResponse?.totalCount ?? 0}{' '}
        reports
      </p>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <DampAndMouldReportTable
            reports={reports}
            showOtherReportsColumn={false}
            showPropertyColumn={false}
          />

          {isMorePages && (
            <>
              <div className="page-navigation govuk-!-padding-bottom-5">
                <Button
                  label="Show more"
                  onClick={handleShowMoreResults}
                  type="submit"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default DampAndMouldReportsPropertyReportsView

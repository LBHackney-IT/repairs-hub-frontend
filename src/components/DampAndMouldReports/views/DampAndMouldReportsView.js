import { useEffect, useState } from 'react'
import { Button } from '../../Form'
import DampAndMouldReportTable from '../components/DampAndMouldReportTable'
import Spinner from '../../Spinner'
import { fetchReports } from '../fetchReports'
import SelectPageSizeFilter from '../components/SelectPageSizeFilter'

const DampAndMouldReportsView = () => {
  const [pageSize, setPageSize] = useState(12)
  const [pageNumber, setPageNumber] = useState(1)
  const [reports, setReports] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // reset pageNumber when pageSize changes
  useEffect(() => {
    setPageNumber(1)
  }, [pageSize])

  useEffect(() => {
    setIsLoading(true)

    fetchReports(pageNumber, pageSize)
      .then((res) => {
        setReports(res)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [pageNumber, pageSize])

  const handleNextPage = () => {
    setPageNumber((x) => x + 1)
  }

  const handlePreviousPage = () => {
    setPageNumber((x) => x - 1)
  }

  return (
    <div className="govuk-body">
      <h1 className="lbh-heading-h1">Damp and mould reports</h1>

      <div className="damp-and-mould-controls">
        <span className="damp-and-mould-showing">
          Showing items {pageSize * (pageNumber - 1) + 1 ?? 0} -{' '}
          {Math.min(pageSize * pageNumber, reports?.totalCount ?? 0)} of{' '}
          {reports?.totalCount ?? 0} results
        </span>

        <SelectPageSizeFilter pageSize={pageSize} setPageSize={setPageSize} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <DampAndMouldReportTable reports={reports.results} />

          <div className="page-navigation govuk-!-padding-bottom-5">
            {pageNumber > 1 && (
              <Button
                label="Previous page"
                onClick={handlePreviousPage}
                type="submit"
                data-testid="dampAndMould_previousPageButton"
              />
            )}
            {pageNumber < reports.pageCount && (
              <Button
                label="Next page"
                onClick={handleNextPage}
                type="submit"
                className="right-page-button"
                data-testid="dampAndMould_nextPageButton"
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DampAndMouldReportsView

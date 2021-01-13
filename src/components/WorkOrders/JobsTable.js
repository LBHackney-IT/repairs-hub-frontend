import { useState, useEffect } from 'react'
import JobRow from './JobRow'
import { getRepairs } from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'

const JobsTable = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const workOrderView = async () => {
    setError(null)

    try {
      const data = await getRepairs()
      const convertDate = (dateAsString) => {
        if (dateAsString) {
          return new Date(dateAsString)
        }
        return dateAsString
      }
      data.forEach((job) => {
        job.dateRaised = convertDate(job.dateRaised)
        job.lastUpdated = convertDate(job.lastUpdated)
      })

      const sortedByDate = data.sort((a, b) => b.dateRaised - a.dateRaised)
      setWorkOrders(sortedByDate)
    } catch (e) {
      setWorkOrders(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    workOrderView()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <p className="govuk-heading-s">Manage jobs</p>

          <table className="govuk-table govuk-!-margin-top-5 govuk-!-width-full">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row govuk-body">
                <th scope="col" className="govuk-table__header">
                  Reference
                </th>
                <th scope="col" className="govuk-table__header">
                  Date raised
                </th>
                <th scope="col" className="govuk-table__header">
                  Last update
                </th>
                <th scope="col" className="govuk-table__header">
                  Priority
                </th>
                <th scope="col" className="govuk-table__header">
                  Property
                </th>
                <th scope="col" className="govuk-table__header">
                  Description
                </th>
              </tr>
            </thead>
            {workOrders && (
              <tbody className="govuk-table__body">
                {workOrders.map((job, index) => (
                  <JobRow key={index} {...job} />
                ))}
              </tbody>
            )}
            {error && <ErrorMessage label={error} />}
          </table>
        </div>
      )}
    </>
  )
}

export default JobsTable

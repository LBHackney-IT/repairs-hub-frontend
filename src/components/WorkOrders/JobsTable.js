import PropTypes from 'prop-types'
import JobRow from './JobRow'
import { PAGE_SIZE_CONTRACTORS } from 'src/utils/frontend-api-client/repairs'

const JobsTable = ({ workOrders, pageNumber, handlePageClick }) => (
  <div>
    <p className="govuk-heading-s">Manage jobs</p>

    <table className="govuk-table govuk-!-margin-top-5 govuk-!-width-full hackney-work-order-table">
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
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            Description
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {workOrders.map((job, index) => (
          <JobRow key={index} {...job} />
        ))}
      </tbody>
    </table>
    <div className="page-navigation govuk-!-padding-bottom-5">
      {pageNumber > 1 && (
        <button
          className="govuk-button left-page-button"
          data-module="govuk-button"
          onClick={() => handlePageClick(pageNumber - 1)}
        >
          Previous page
        </button>
      )}
      {pageNumber && workOrders.length >= PAGE_SIZE_CONTRACTORS && (
        <button
          className="govuk-button right-page-button"
          data-module="govuk-button"
          onClick={() => handlePageClick(pageNumber + 1)}
        >
          Next page
        </button>
      )}
    </div>
  </div>
)

JobsTable.propTypes = {
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.number,
      dateRaised: PropTypes.string,
      lastUpdated: PropTypes.instanceOf(Date),
      priority: PropTypes.string,
      property: PropTypes.string,
      status: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  pageNumber: PropTypes.number,
  handlePageClick: PropTypes.func,
}

export default JobsTable

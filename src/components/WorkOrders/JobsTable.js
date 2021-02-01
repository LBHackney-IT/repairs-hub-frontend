import PropTypes from 'prop-types'
import JobRow from './JobRow'

const JobsTable = ({ workOrders }) => (
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
          <th scope="col" className="govuk-table__header"></th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {workOrders.map((job, index) => (
          <JobRow key={index} {...job} />
        ))}
      </tbody>
    </table>
  </div>
)

JobsTable.propTypes = {
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
      dateRaised: PropTypes.instanceOf(Date),
      lastUpdated: PropTypes.instanceOf(Date),
      priority: PropTypes.string,
      property: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default JobsTable

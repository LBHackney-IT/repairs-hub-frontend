import PropTypes from 'prop-types'
import WorkOrderRow from './WorkOrderRow'
import { PAGE_SIZE_CONTRACTORS } from 'src/utils/frontend-api-client/work-orders'
import { Button } from '../Form'

const WorkOrdersTable = ({ workOrders, pageNumber, handlePageClick }) => (
  <div>
    <p className="lbh-heading-h4">Manage jobs</p>

    <table className="govuk-table govuk-!-margin-top-5 govuk-!-width-full hackney-work-order-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row lbh-body">
          <th scope="col" className="govuk-table__header">
            Reference
          </th>
          <th scope="col" className="govuk-table__header">
            Date raised
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
            Trade
          </th>
          <th scope="col" className="govuk-table__header">
            Description
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {workOrders.map((job, index) => (
          <WorkOrderRow key={index} {...job} />
        ))}
      </tbody>
    </table>
    <div className="page-navigation govuk-!-padding-bottom-5">
      {pageNumber > 1 && (
        <Button
          label="Previous page"
          onClick={() => handlePageClick(pageNumber - 1)}
          type="submit"
        />
      )}
      {pageNumber && workOrders.length >= PAGE_SIZE_CONTRACTORS && (
        <Button
          label="Next page"
          onClick={() => handlePageClick(pageNumber + 1)}
          type="submit"
          className="right-page-button"
        />
      )}
    </div>
  </div>
)

WorkOrdersTable.propTypes = {
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

export default WorkOrdersTable

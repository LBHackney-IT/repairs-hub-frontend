import PropTypes from 'prop-types'
import WorkOrderRow from './WorkOrderRow'
import { PAGE_SIZE_CONTRACTORS } from 'src/utils/frontend-api-client/work-orders'
import { Button } from '../Form'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

const WorkOrdersTable = ({ workOrders, pageNumber, handlePageClick }) => (
  <div>
    <h4 className="lbh-heading-h4">Manage work orders</h4>

    <Table className="govuk-!-margin-top-5 govuk-!-width-full hackney-work-order-table">
      <THead>
        <TR className="lbh-body">
          <TH scope="col">Reference</TH>
          <TH scope="col">Date raised</TH>
          <TH scope="col">Priority</TH>
          <TH scope="col">Property</TH>
          <TH scope="col">Status</TH>
          <TH scope="col">Trade</TH>
          <TH scope="col">Description</TH>
        </TR>
      </THead>
      <TBody>
        {workOrders.map((job, index) => (
          <WorkOrderRow key={index} {...job} />
        ))}
      </TBody>
    </Table>
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

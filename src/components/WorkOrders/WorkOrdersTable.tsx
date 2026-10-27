import WorkOrderRow, { WorkOrderListItem } from './WorkOrderRow'
import { Button } from '../Form'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

interface Props {
  workOrders: WorkOrderListItem[]
  pageNumber: number
  handlePageClick: (pageNumber: number) => void
  pageSize: number
}

const WorkOrdersTable = ({
  workOrders,
  pageNumber,
  handlePageClick,
  pageSize,
}: Props) => (
  <div>
    <Table className="govuk-!-margin-top-5 govuk-!-width-full hackney-work-order-table">
      <THead>
        <TR className="lbh-body">
          <TH scope="col" className="lbh-body-xs">
            Reference
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Date raised
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Priority
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Property
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Status
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Trade
          </TH>
          <TH scope="col" className="lbh-body-xs">
            Description
          </TH>
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
      {pageNumber && workOrders.length >= pageSize && (
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

export default WorkOrdersTable

import type { WorkOrder } from '@/root/src/models/workOrder'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'

interface Props {
  workOrder: Pick<WorkOrder, 'property' | 'tradeDescription' | 'description'>
}

const WorkOrderInfoTable = ({ workOrder }: Props) => (
  <div>
    <Table className="govuk-!-margin-top-5 govuk-!-width-full">
      <TBody>
        <TR id="property">
          <TH scope="row">Property</TH>
          <TD>{workOrder.property}</TD>
        </TR>
        <TR id="tradeDescription">
          <TH scope="row">Trade</TH>
          <TD>{workOrder.tradeDescription}</TD>
        </TR>
        <TR id="description">
          <TH scope="row">Description</TH>
          <TD>{workOrder.description}</TD>
        </TR>
      </TBody>
    </Table>
  </div>
)

export default WorkOrderInfoTable

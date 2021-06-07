import PropTypes from 'prop-types'
import { Table, TBody, TR, TH, TD } from '../Layout/Table'

const WorkOrderInfoTable = ({ workOrder }) => (
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

WorkOrderInfoTable.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default WorkOrderInfoTable

import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'

const WorkOrderTasks = ({ tasks }) => {
  return (
    <GridRow className="lbh-body-s">
      <GridColumn width="full">
        <h2 className="lbh-heading-h2 govuk-!-margin-bottom-1">
          Work order task details
        </h2>

        <Table className="govuk-!-margin-top-1 govuk-!-margin-bottom-3">
          <THead>
            <TR className="lbh-body">
              <TH
                scope="col"
                width="one-quarter"
              >
                SOR Code
              </TH>
              <TH
                scope="col"
                width="one-half"
              >
                Description
              </TH>
              <TH
                scope="col"
                type="numeric"
                width="one-quarter"
              >
                Quantity (est.)
              </TH>
            </TR>
          </THead>
          <TBody>
            {tasks.map((entry, index) => (
              <TR key={index}>
                <TD width="one-quarter">{entry.code}</TD>
                <TD width="one-half">{entry.description}</TD>
                <TD
                  type="numeric"
                  width="one-quarter"
                >
                  {entry.quantity}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </GridColumn>
    </GridRow>
  )
}

WorkOrderTasks.propTypes = {
  tasks: PropTypes.array.isRequired,
}

export default WorkOrderTasks

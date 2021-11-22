import PropTypes from 'prop-types'
import {
  calculateCostBeforeVariation,
  calculateChangeInCost,
} from '@/utils/helpers/calculations'
import { longDateToStr } from '@/utils/date'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'
import Status from '../Status'
import Collapsible from 'src/components/Layout/Collapsible'

const VariationAuthorisationSummary = ({
  variationTasks,
  originalSors,
  totalCostAfterVariation,
}) => {
  const COST_BEFORE_VARIATION = 'Cost before variation'
  const TOTAL_VARIED_COST = 'Total cost after variation'
  const CHANGE_IN_COST = 'Change in cost'

  const sorStatus = (task) => {
    if (task.currentQuantity == 0 && task.originalQuantity == 0) {
      return 'New'
    }
    if (task.variedQuantity > task.currentQuantity) {
      return 'Increased'
    }
    if (task.variedQuantity < task.currentQuantity) {
      return 'Reduced'
    }
    return 'Unchanged'
  }
  const getCost = (task) => {
    return task.unitCost ? task.unitCost : 0.0
  }

  //cost calculation before variation, change in cost and total varied coast
  const costBeforeVariation = {
    description: COST_BEFORE_VARIATION,
    cost: calculateCostBeforeVariation(variationTasks.tasks),
  }
  const changeInCost = {
    description: CHANGE_IN_COST,
    cost: calculateChangeInCost(variationTasks.tasks),
  }
  const totalVaried = {
    description: TOTAL_VARIED_COST,
    cost: totalCostAfterVariation,
  }

  //show cost breakdown
  const showCostBreakdown = () => {
    return [costBeforeVariation, changeInCost, totalVaried].map(
      (object, index) => (
        <TR
          key={index}
          id={object.description.toLowerCase().replace(/\s/g, '-')}
        >
          <TH scope="row">{}</TH>
          <TH scope="row">{}</TH>
          <TH scope="row">{}</TH>
          <TH scope="row">{}</TH>
          <TH scope="row">{}</TH>

          <TD
            padding="top-3"
            border={
              object.description !== COST_BEFORE_VARIATION
                ? 'top-black'
                : undefined
            }
          >
            <strong>{object.description}</strong>
          </TD>
          <TD
            padding="top-3"
            border={
              object.description !== COST_BEFORE_VARIATION
                ? 'top-black'
                : undefined
            }
            type="numeric"
          >
            £{object.cost ? object.cost.toFixed(2) : '-'}
          </TD>
        </TR>
      )
    )
  }

  const updatedSORsToShow = () => {
    return (
      <>
        <p className="lbh-body">Updated by: {variationTasks.authorName} </p>
        <p className="lbh-body">
          {longDateToStr(variationTasks.variationDate)}{' '}
        </p>
        <div className="lbh-stat">
          <span className="lbh-stat__caption">{variationTasks.notes}</span>
        </div>

        <Table className="lbh-table updated-tasks-table">
          <THead>
            <TR>
              <TH scope="col">SOR Status</TH>
              <TH scope="col">SOR code</TH>
              <TH scope="col" type="numeric">
                Unit Cost
              </TH>
              <TH scope="col" type="numeric">
                Quantity
              </TH>
              <TH scope="col" type="numeric">
                Cost
              </TH>
              <TH scope="col" type="numeric">
                Varied quantity
              </TH>
              <TH scope="col" type="numeric">
                Varied Cost
              </TH>
            </TR>
          </THead>

          <TBody>
            {variationTasks.tasks
              ? variationTasks.tasks.map((task, index) => (
                  <TR index={index} key={index}>
                    <TD>
                      <Status text={sorStatus(task)} />
                    </TD>
                    <TD>
                      {task.code}
                      <p>{task.description}</p>
                    </TD>
                    <TD type="numeric">£{getCost(task)}</TD>
                    <TD type="numeric">{task.currentQuantity}</TD>
                    <TD type="numeric">
                      £{getCost(task) * task.currentQuantity}
                    </TD>
                    <TD type="numeric">{task.variedQuantity}</TD>
                    <TD type="numeric">
                      £{getCost(task) * task.variedQuantity}
                    </TD>
                  </TR>
                ))
              : ''}
          </TBody>
        </Table>

        <Table className="lbh-table calculated-cost">
          <TBody>{variationTasks.tasks ? showCostBreakdown() : ''}</TBody>
        </Table>
      </>
    )
  }

  const originalSORsToShow = () => {
    return (
      <>
        <Table className="lbh-table original-sor-summary">
          <THead>
            <TR>
              <TH scope="col">SOR code</TH>
              <TH scope="col" type="numeric">
                Quantity
              </TH>
              <TH scope="col" type="numeric">
                Cost
              </TH>
            </TR>
          </THead>
          <TBody>
            {originalSors.map((task, index) => (
              <TR key={index}>
                <TD>
                  {task.code} - {task.description}
                </TD>
                <TD type="numeric">{task.originalQuantity}</TD>
                <TD type="numeric">£{task.cost}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </>
    )
  }

  return (
    <>
      <h2 className="lbh-heading-h2">Summary of Tasks and SORs</h2>
      <Collapsible
        heading="Original SORs"
        collapsableDivClassName="original-sors"
        children={originalSORsToShow()}
      />

      <Collapsible
        heading="Updated Tasks SORs"
        collapsableDivClassName="updated-sors"
        children={updatedSORsToShow()}
      />
    </>
  )
}

VariationAuthorisationSummary.propTypes = {
  variationTasks: PropTypes.object.isRequired,
  originalSors: PropTypes.array.isRequired,
}

export default VariationAuthorisationSummary

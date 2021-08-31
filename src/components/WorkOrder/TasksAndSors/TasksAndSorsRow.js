import PropTypes from 'prop-types'
import { TR, TD } from '../../Layout/Table'

const tasksAndSorsRow = ({
  code,
  description,
  taskQuantity,
  cost,
  index,
  standardMinuteValue,
}) => (
  <TR index={index} className="lbh-body-s">
    <TD>{code}</TD>
    <TD>{description}</TD>
    <TD>{taskQuantity}</TD>
    <TD type="numeric">£{cost}</TD>
    <TD type="numeric">£{parseFloat(cost * taskQuantity).toFixed(2)}</TD>
    <TD type="numeric">{standardMinuteValue}</TD>
  </TR>
)

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  taskQuantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  standardMinuteValue: PropTypes.number.isRequired,
}

export default tasksAndSorsRow

import PropTypes from 'prop-types'
import { formatDateTime } from '../../../utils/time'
import { TR, TD } from '../../Layout/Table'

const tasksAndSorsRow = ({
  code,
  description,
  dateAdded,
  taskQuantity,
  cost,
  index,
}) => (
  <TR index={index} className="lbh-body-s">
    <TD>{code}</TD>
    <TD>{description}</TD>
    <TD>{dateAdded ? formatDateTime(dateAdded) : '—'}</TD>
    <TD>{taskQuantity}</TD>
    <TD>£{cost}</TD>
    <TD>£{parseFloat(cost * taskQuantity).toFixed(2)}</TD>
  </TR>
)

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dateAdded: PropTypes.instanceOf(Date).isRequired,
  taskQuantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
}

export default tasksAndSorsRow

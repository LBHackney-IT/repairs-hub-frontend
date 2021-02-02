import PropTypes from 'prop-types'
import { formatDateTime } from '../../../utils/time'

const tasksAndSorsRow = ({
  code,
  description,
  dateAdded,
  quantity,
  cost,
  status,
  index,
}) => (
  <tr
    data-row-id={index}
    className="govuk-table__row govuk-table__row--clickable govuk-body-s"
  >
    <td className="govuk-table__cell">{code}</td>
    <td className="govuk-table__cell">{description}</td>
    <td className="govuk-table__cell">
      {dateAdded ? formatDateTime(dateAdded) : '—'}
    </td>
    <td className="govuk-table__cell">{quantity}</td>
    <td className="govuk-table__cell">{cost}</td>
    <td className="govuk-table__cell">{status}</td>
  </tr>
)

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dateAdded: PropTypes.instanceOf(Date).isRequired,
  quantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}

export default tasksAndSorsRow

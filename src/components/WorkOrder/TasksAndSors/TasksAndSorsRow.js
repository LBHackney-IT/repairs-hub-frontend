import PropTypes from 'prop-types'
import { TR, TD } from '../../Layout/Table'
import Link from 'next/link'
import cx from 'classnames'

const tasksAndSorsRow = ({
  showOperativeTasksAndSorsRow,
  code,
  description,
  taskQuantity,
  cost,
  index,
  standardMinuteValue,
  quantity,
  isOriginal,
  originalQuantity,
  sorLink,
  readOnly,
}) => {
  return !showOperativeTasksAndSorsRow ? (
    <TR index={index} className="lbh-body">
      <TD>{code}</TD>
      <TD>{description}</TD>
      <TD>{taskQuantity}</TD>
      <TD type="numeric">{taskQuantity === 0 ? '-' : `£${cost}`}</TD>
      <TD type="numeric">
        {taskQuantity === 0
          ? '-'
          : `£${parseFloat(cost * taskQuantity).toFixed(2)}`}
      </TD>
      <TD type="numeric">
        {' '}
        {taskQuantity === 0
          ? '-'
          : isOriginal
          ? standardMinuteValue * originalQuantity
          : standardMinuteValue * quantity}
      </TD>
    </TR>
  ) : (
    <TR
      index={index}
      className={cx('lbh-body', { 'zero-quantity-row': taskQuantity === 0 })}
    >
      <TD>{taskQuantity}</TD>
      {readOnly ? (
        <>
          <TD>{code}</TD>
          <TD>{description}</TD>
        </>
      ) : (
        <>
          <TD>
            <Link href={sorLink} legacyBehavior>
              <a className="govuk-link">{code}</a>
            </Link>
          </TD>
          <TD>
            <Link href={sorLink} legacyBehavior>
              <a className="govuk-link">{description}</a>
            </Link>
          </TD>
        </>
      )}
      <TD type="numeric">{standardMinuteValue * quantity}</TD>
    </TR>
  )
}

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  taskQuantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  standardMinuteValue: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  isOriginal: PropTypes.bool,
  originalQuantity: PropTypes.number,
}

export default tasksAndSorsRow

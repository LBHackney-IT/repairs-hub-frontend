import { TR, TD } from '../../Layout/Table'
import Link from 'next/link'
import cx from 'classnames'

interface Props {
  showOperativeTasksAndSorsRow?: boolean
  code: string
  description: string
  taskQuantity: number
  cost?: number
  index: number
  standardMinuteValue: number
  quantity: number
  isOriginal?: boolean
  originalQuantity?: number
  sorLink?: string
  readOnly?: boolean
  [key: string]: any
}

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
}: Props) => {
  return !showOperativeTasksAndSorsRow ? (
    <TR index={index} className="lbh-body">
      <TD>{code}</TD>
      <TD>{description}</TD>
      <TD>{taskQuantity}</TD>
      <TD type="numeric">{taskQuantity === 0 ? '-' : `£${cost}`}</TD>
      <TD type="numeric">
        {taskQuantity === 0 ? '-' : `£${(cost * taskQuantity).toFixed(2)}`}
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

export default tasksAndSorsRow

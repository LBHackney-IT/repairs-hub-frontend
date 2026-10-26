import cx from 'classnames'
import { ReactNode } from 'react'

interface BaseProps {
  className?: string
  children?: ReactNode
}

interface TableRowProps extends BaseProps {
  index?: number
  reference?: string | number
  id?: string
}

interface TableHeaderProps extends BaseProps {
  scope?: 'col' | 'row'
  colSpan?: number
  width?: string
  type?: string
}

interface TableCellProps extends BaseProps {
  width?: string
  padding?: string | number
  type?: string
  border?: string
  colSpan?: number
}

export const Table = (props: BaseProps) => (
  <table className={cx('govuk-table lbh-table', props.className)}>
    {props.children}
  </table>
)

export const THead = (props: BaseProps) => (
  <thead className={cx('govuk-table__head', props.className)}>
    {props.children}
  </thead>
)

export const TBody = (props: BaseProps) => (
  <tbody className={cx('govuk-table__body', props.className)}>
    {props.children}
  </tbody>
)

export const TR = (props: TableRowProps) => (
  <tr
    data-row-id={props.index}
    data-ref={props.reference}
    className={cx('govuk-table__row', props.className)}
    id={props.id}
  >
    {props.children}
  </tr>
)

export const TH = (props: TableHeaderProps) => (
  <th
    scope={props.scope}
    className={cx(
      'govuk-table__header',
      props.width ? `govuk-!-width-${props.width}` : null,
      props.type ? `govuk-table__header--${props.type}` : null,
      props.className
    )}
  >
    {props.children}
  </th>
)

export const TD = (props: TableCellProps) => (
  <td
    className={cx(
      'govuk-table__cell',
      props.width ? `govuk-!-width-${props.width}` : null,
      props.padding ? `govuk-!-padding-${props.padding}` : null,
      props.type ? `govuk-table__cell--${props.type}` : null,
      props.border ? `border-${props.border}` : null,
      props.className
    )}
    colSpan={props.colSpan}
  >
    {props.children}
  </td>
)

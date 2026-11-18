import { ReactNode } from 'react'
import cx from 'classnames'

interface BaseProps {
  className?: string
  children?: ReactNode
}

export const Table = ({ className, children }: BaseProps) => (
  <table className={cx('govuk-table lbh-table', className)}>{children}</table>
)

export const THead = ({ className, children }: BaseProps) => (
  <thead className={cx('govuk-table__head', className)}>{children}</thead>
)

export const TBody = ({ className, children }: BaseProps) => (
  <tbody className={cx('govuk-table__body', className)}>{children}</tbody>
)

interface TRProps extends BaseProps {
  index?: number | string
  reference?: string | number
  id?: string
}

export const TR = ({ index, reference, className, id, children }: TRProps) => (
  <tr
    data-row-id={index}
    data-ref={reference}
    className={cx('govuk-table__row', className)}
    id={id}
  >
    {children}
  </tr>
)

interface THProps extends BaseProps {
  scope?: string
  colSpan?: number
  width?: string
  type?: string
}

export const TH = ({
  scope,
  colSpan,
  width,
  type,
  className,
  children,
}: THProps) => (
  <th
    scope={scope}
    colSpan={colSpan}
    className={cx(
      'govuk-table__header',
      width ? `govuk-!-width-${width}` : null,
      type ? `govuk-table__header--${type}` : null,
      className
    )}
  >
    {children}
  </th>
)

interface TDProps extends BaseProps {
  width?: string
  padding?: string | number
  type?: string
  border?: string
  colSpan?: number
}

export const TD = ({
  width,
  padding,
  type,
  border,
  colSpan,
  className,
  children,
}: TDProps) => (
  <td
    className={cx(
      'govuk-table__cell',
      width ? `govuk-!-width-${width}` : null,
      padding ? `govuk-!-padding-${padding}` : null,
      type ? `govuk-table__cell--${type}` : null,
      border ? `border-${border}` : null,
      className
    )}
    colSpan={colSpan}
  >
    {children}
  </td>
)

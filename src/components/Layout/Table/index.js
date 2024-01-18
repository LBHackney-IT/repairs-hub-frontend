import cx from 'classnames'

export const Table = (props) => (
  <table className={cx('govuk-table lbh-table', props.className)}>
    {props.children}
  </table>
)

export const THead = (props) => (
  <thead className={cx('govuk-table__head', props.className)}>
    {props.children}
  </thead>
)

export const TBody = (props) => (
  <tbody className={cx('govuk-table__body', props.className)}>
    {props.children}
  </tbody>
)

export const TR = (props) => (
  <tr
    data-row-id={props.index}
    data-ref={props.reference}
    className={cx('govuk-table__row', props.className)}
    id={props.id}
  >
    {props.children}
  </tr>
)

export const TH = (props) => (
  <th
    scope={props.scope}
    className={cx(
      'govuk-table__header',
      props.width ? `govuk-!-width-${props.width}` : null,
      props.type ? `govuk-table__header--${props.type}` : null,
      props.className
    )}
    colSpan={props.colSpan}
  >
    {props.children}
  </th>
)

export const TD = (props) => (
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

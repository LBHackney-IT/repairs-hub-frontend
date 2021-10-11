import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

const WorkOrderUpdateSuccess = ({
  workOrderReference,
  requiresAuthorisation,
}) => {
  const text = requiresAuthorisation
    ? `Work order ${workOrderReference} requires authorisation and has been sent to a manager`
    : `Work order ${workOrderReference} has been successfully updated`
  return (
    <div>
      <div
        className={cx('govuk-panel govuk-panel--confirmation', {
          'background-dark-green': !requiresAuthorisation,
          'background-yellow': requiresAuthorisation,
        })}
      >
        <div
          className={cx('govuk-panel__body', {
            'text-black': requiresAuthorisation,
          })}
        >
          <strong className="">{text}</strong>
        </div>
      </div>

      <ul className="lbh-list govuk-!-margin-top-9">
        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a className="lbh-link">
              <strong>View work order</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a className="lbh-link">
              <strong>View work orders dashboard</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

WorkOrderUpdateSuccess.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  requiresAuthorisation: PropTypes.bool.isRequired,
}

export default WorkOrderUpdateSuccess

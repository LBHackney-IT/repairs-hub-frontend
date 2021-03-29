import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

const UpdateJobSuccess = ({ workOrderReference, requiresAuthorisation }) => {
  const text = requiresAuthorisation
    ? `Job ${workOrderReference} requires authorisation and has been sent to a manager`
    : `Job ${workOrderReference} has been successfully updated`
  return (
    <div>
      <div
        className={cx('govuk-panel govuk-panel--confirmation', {
          'background-green': !requiresAuthorisation,
          'background-red': requiresAuthorisation,
        })}
      >
        <div className="govuk-panel__body">
          <strong className="">{text}</strong>
        </div>
      </div>

      <ul className="govuk-list govuk-!-margin-top-9">
        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a>
              <strong>View work order</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a>
              <strong>View jobs dashboard</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

UpdateJobSuccess.propTypes = {
  workOrderReference: PropTypes.number.isRequired,
  requiresAuthorisation: PropTypes.bool.isRequired,
}

export default UpdateJobSuccess

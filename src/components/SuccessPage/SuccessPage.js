import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'

const SuccessPage = ({ ...props }) => {
  return (
    <div>
      <section className="text-align-center lbh-page-announcement">
        {props.isRaiseRepairSuccess ? (
          <div className="lbh-announcement__content">
            <h2>{props.text}</h2>
            <p>Works order number</p>
            <strong className="govuk-!-font-size-24">
              {props.workOrderReference}
            </strong>
          </div>
        ) : (
          <div className="lbh-announcement__content">
            <p>
              {props.text}{' '}
              <strong>work order {props.workOrderReference}</strong>
            </p>
          </div>
        )}
      </section>

      {props.authorisationPendingApproval && (
        <WarningText
          text={`Works order ${props.workOrderReference} requires authorisation. Please request authorisation from a manager.`}
        />
      )}

      <ul className="lbh-list lbh-!-margin-top-9">
        {props.externalSchedulerLink && (
          <li>
            Please{' '}
            <Link href={props.externalSchedulerLink}>
              <a className="lbh-link" target="_blank" rel="noopener">
                <strong>open DRS</strong>
              </a>
            </Link>{' '}
            to book an appointment
          </li>
        )}

        {props.workOrderReference && (
          <li>
            <Link href={`/work-orders/${props.workOrderReference}`}>
              <a className="lbh-link">
                <strong>View work order</strong>
              </a>
            </Link>
          </li>
        )}

        {props.shortAddress && (
          <li>
            <Link href={`/properties/${props.propertyReference}`}>
              <a className="lbh-link">
                <strong>Back to {props.shortAddress}</strong>
              </a>
            </Link>
          </li>
        )}

        {props.showSearchLink && (
          <li>
            <Link href="/">
              <a className="lbh-link">
                <strong>Start a new search</strong>
              </a>
            </Link>
          </li>
        )}

        {props.showDashboardLink && (
          <li>
            <Link href="/">
              <a className="lbh-link">
                <strong>Back to dashboard</strong>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

SuccessPage.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isRaiseRepairSuccess: PropTypes.bool,
  showDashboardLink: PropTypes.bool,
  shortAddress: PropTypes.string,
  showSearchLink: PropTypes.bool,
  authorisationPendingApproval: PropTypes.bool,
}

export default SuccessPage

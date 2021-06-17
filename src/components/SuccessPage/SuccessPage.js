import PropTypes from 'prop-types'
import Link from 'next/link'
import WarningText from '../Template/WarningText'

const SuccessPage = ({ ...props }) => {
  return (
    <>
      <section className="text-align-center lbh-page-announcement">
        <h3 className="lbh-page-announcement__title">{props.text}</h3>
        <div className="lbh-page-announcement__content">
          <p>Works order number</p>
          <strong className="govuk-!-font-size-24">
            {props.workOrderReference}
          </strong>
        </div>
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

        {props.immediateOrEmergencyDloRepairText && (
          <li>
            <p>
              <strong>
                Emergency and immediate DLO repairs are sent directly to the
                Planners. An appointment does not need to be booked.
              </strong>
            </p>
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
    </>
  )
}

SuccessPage.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  showDashboardLink: PropTypes.bool,
  shortAddress: PropTypes.string,
  showSearchLink: PropTypes.bool,
  authorisationPendingApproval: PropTypes.bool,
}

export default SuccessPage

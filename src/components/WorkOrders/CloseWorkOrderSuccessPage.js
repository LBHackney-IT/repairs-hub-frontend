import PropTypes from 'prop-types'
import Link from 'next/link'

const CloseWorkOrderSuccessPage = ({ workOrderReference }) => {
  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation background-dark-green">
        <div className="govuk-panel__body">
          <strong>You have closed work order {workOrderReference}</strong>
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
              <strong>Manage work orders</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

CloseWorkOrderSuccessPage.propTypes = {
  workOrderReference: PropTypes.number.isRequired,
}

export default CloseWorkOrderSuccessPage

import PropTypes from 'prop-types'
import Link from 'next/link'

const CancelWorkOrderFormSuccess = ({
  workOrderReference,
  propertyReference,
  shortAddress,
}) => {
  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation background-dark-green">
        <h1 className="lbh-heading-h1 text-white">Repair cancelled</h1>
        <div className="govuk-panel__body">
          Works order {workOrderReference} has been cancelled
        </div>
      </div>

      <ul className="govuk-list govuk-!-margin-top-9">
        <li>
          <Link href={`/properties/${propertyReference}/raise-repair/new`}>
            <a className="lbh-link">
              <strong>New repair for {shortAddress}</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a className="lbh-link">
              <strong>Start a new search</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a className="lbh-link">
              <strong>Back to work order</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

CancelWorkOrderFormSuccess.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrderReference: PropTypes.string.isRequired,
  shortAddress: PropTypes.string.isRequired,
}

export default CancelWorkOrderFormSuccess

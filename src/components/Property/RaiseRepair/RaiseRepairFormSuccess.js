import PropTypes from 'prop-types'
import Link from 'next/link'

const RaiseRepairFormSuccess = ({
  propertyReference,
  workOrderReference,
  shortAddress,
  externalSchedulerLink,
}) => {
  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation background-dark-green">
        <h1 className="lbh-heading-xl text-white">Repair work order created</h1>
        <div className="govuk-panel__body">
          Work order number
          <br></br>
          <strong className="govuk-!-font-size-48">{workOrderReference}</strong>
        </div>
      </div>

      <ul className="govuk-list govuk-!-margin-top-9">
        {externalSchedulerLink && (
          <li>
            Please{' '}
            <Link href={externalSchedulerLink}>
              <a>
                <strong>open DRS</strong>
              </a>
            </Link>{' '}
            to book an appointment
          </li>
        )}

        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a>
              <strong>View work order</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/properties/${propertyReference}`}>
            <a>
              <strong>Back to {shortAddress}</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a>
              <strong>Start a new search</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

RaiseRepairFormSuccess.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrderReference: PropTypes.number.isRequired,
  shortAddress: PropTypes.string.isRequired,
}

export default RaiseRepairFormSuccess

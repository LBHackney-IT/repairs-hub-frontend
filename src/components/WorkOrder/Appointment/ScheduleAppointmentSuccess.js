import PropTypes from 'prop-types'
import Link from 'next/link'

const ScheduleAppointmentSuccess = ({
  workOrderReference,
  property,
  comments,
  slot,
  dateSelected,
}) => {
  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation background-dark-green">
        <h1 className="lbh-heading-h1 text-white">Repair work order created</h1>
        <div className="govuk-panel__body">
          <p className="govuk-!-margin-top-3">Work order number</p>
          <strong className="govuk-!-font-size-41">{workOrderReference}</strong>
          <br />
          <br />
          <strong className="govuk-!-font-size-36">{dateSelected}</strong>
          <br></br>
          <strong className="govuk-!-font-size-36">{slot.split(' ')[0]}</strong>
          <br></br>
          <p>Comments: {comments}</p>
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
          <Link href={`/properties/${property.propertyReference}`}>
            <a>
              <strong>Back to {property.address.addressLine}</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/`}>
            <a>
              <strong>Start a new search</strong>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

ScheduleAppointmentSuccess.propTypes = {
  property: PropTypes.object.isRequired,
  workOrderReference: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  dateSelected: PropTypes.string.isRequired,
}

export default ScheduleAppointmentSuccess

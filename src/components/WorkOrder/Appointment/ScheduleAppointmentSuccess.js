import PropTypes from 'prop-types'
import Link from 'next/link'
import Panel from '../../Template/Panel'

const ScheduleAppointmentSuccess = ({
  workOrderReference,
  property,
  comments,
  slot,
  dateSelected,
}) => {
  return (
    <div>
      <Panel
        title="Repair work order created"
        workOrderReference={workOrderReference}
        dateSelected={dateSelected}
        slot={slot.split(' ')[0]}
        comments={comments}
      />

      <ul className="lbh-list govuk-!-margin-top-9">
        <li>
          <Link href={`/work-orders/${workOrderReference}`}>
            <a className="lbh-link">
              <strong>View work order</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/properties/${property.propertyReference}`}>
            <a className="lbh-link">
              <strong>Back to {property.address.addressLine}</strong>
            </a>
          </Link>
        </li>

        <li>
          <Link href={`/`}>
            <a className="lbh-link">
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

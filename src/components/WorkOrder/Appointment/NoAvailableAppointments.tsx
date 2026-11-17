import Link from 'next/link'

interface Props {
  workOrderReference: string
}

const NoAvailableAppointments = ({ workOrderReference }: Props) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="timeslot-form govuk-!-padding-4">
          <h2 className="lbh-heading-h2" id="no-appointment">
            No available appointments
          </h2>
          <p className="lbh-body">
            {' '}
            Contractor should contact the resident to make the appointment.
          </p>
        </div>
        <ul className="lbh-list govuk-!-margin-top-9">
          <li>
            <Link href={`/work-orders/${workOrderReference}`} legacyBehavior>
              <a className="lbh-link">
                <strong>View work order</strong>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NoAvailableAppointments

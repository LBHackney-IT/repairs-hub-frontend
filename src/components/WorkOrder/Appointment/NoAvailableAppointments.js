const NoAvailableAppointments = () => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="timeslot-form govuk-!-padding-4">
          <h2 className="lbh-heading-h2" id="no-appointment">
            No available appointments
          </h2>
          <p className="govuk-body">
            {' '}
            Contractor should contact the resident to make the appointment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoAvailableAppointments

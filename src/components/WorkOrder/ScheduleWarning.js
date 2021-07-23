const ScheduleWarning = ({ hasExistingAppointment }) => {
  return (
    <div className="schedule-warning govuk-inset-text lbh-inset-text">
      <div className="lbh-warning-text govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <div className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          <p className="govuk-!-margin-top-0 lbh-body-s lbh-!-font-weight-bold">
            Appointment is today
          </p>
          <p className="lbh-body-xs govuk-!-margin-top-1">
            Contact the operative before{' '}
            {hasExistingAppointment ? 'rescheduling' : 'scheduling'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScheduleWarning

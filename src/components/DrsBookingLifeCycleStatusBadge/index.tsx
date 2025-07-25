import WarningInfoBox from '../Template/WarningInfoBox'

const DESPATCHED_BOOKING_STATUS = 'DESPATCHED'

interface Props {
  bookingLifeCycleStatus: string
}

export const DrsBookingLifeCycleStatusBadge = ({
  bookingLifeCycleStatus,
}: Props) => {
  if (bookingLifeCycleStatus === null || bookingLifeCycleStatus === '') {
    return null
  }

  return (
    <>
      <p
        className="lbh-body-s"
        style={{
          color: '#f9fafb',
          background: '#4b5563',
          display: 'inline-block',
          padding: '2px 6px',
          marginBottom: '15px',
          marginTop: '5px',
          borderRadius: '2px',
          fontWeight: 'normal',
          letterSpacing: '2px',
          fontSize: '13px',
        }}
      >
        {bookingLifeCycleStatus}
      </p>

      {bookingLifeCycleStatus === DESPATCHED_BOOKING_STATUS && (
        <WarningInfoBox
          className="variant-warning govuk-!-margin-bottom-4"
          header="Work order cannot be cancelled"
          name="despatched-warning"
          text="The work order is locked after being dispatched to the operative. If you need to cancel the job, please contact a planner to unlock the job in DRS."
        />
      )}
    </>
  )
}

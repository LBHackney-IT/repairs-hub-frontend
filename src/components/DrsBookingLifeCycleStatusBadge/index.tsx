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
    <p
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
  )
}

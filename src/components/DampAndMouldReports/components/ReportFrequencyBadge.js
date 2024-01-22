import cx from 'classnames'

const ReportFrequencyBadge = ({ numberOfReports, reportedAt }) => {
  const isWithin30Days = (reportedAt) => {
    const currentTimestamp = Date.now()
    const thirtyDaysAgoTimestamp = currentTimestamp - 30 * 24 * 60 * 60 * 1000

    return new Date(reportedAt) >= thirtyDaysAgoTimestamp
  }

  // skip "new reports" if older than 30 days
  if (numberOfReports <= 1 && !isWithin30Days(reportedAt)) {
    return <></>
  }

  return (
    <div style={{ marginTop: '5px', marginLeft: '-5px' }}>
      <span
        className={cx([
          'damp-and-mould-report-frequency-badge ',
          numberOfReports > 1 ? 'recurring-report' : 'new-report',
        ])}
      >
        {numberOfReports > 1
          ? `${numberOfReports} recent reports`
          : `New report`}
      </span>
    </div>
  )
}

export default ReportFrequencyBadge

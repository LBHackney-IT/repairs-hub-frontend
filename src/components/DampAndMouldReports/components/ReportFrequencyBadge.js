import cx from 'classnames'

const ReportFrequencyBadge = ({ numberOfReports }) => {
  return (
    <div style={{ marginTop: '5px', marginLeft: '-5px' }}>
      <span
        className={cx([
          'damp-and-mould-report-frequency-badge ',
          numberOfReports === 0 ? 'new-report' : 'recurring-report',
        ])}
      >
        {numberOfReports === 0
          ? 'New report'
          : `${numberOfReports} recent reports`}
      </span>
    </div>
  )
}

export default ReportFrequencyBadge

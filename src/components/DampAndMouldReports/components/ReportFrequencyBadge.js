import cx from 'classnames'

const ReportFrequencyBadge = ({ numberOfReports }) => {
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
          : 'New report'}
      </span>
    </div>
  )
}

export default ReportFrequencyBadge

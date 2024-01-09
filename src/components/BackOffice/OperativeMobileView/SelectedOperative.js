const SelectedOperative = (props) => {
  const { operative } = props

  return (
    <div
      style={{
        background: '#f1f5f9',
        color: '#475569',
        padding: 15,
      }}
    >
      <p>
        Name:{' '}
        <span style={{ color: '#090909', fontWeight: 'bold' }}>
          {operative.name}
        </span>
      </p>
      <p>
        Payroll number:{' '}
        <span style={{ color: '#090909', fontWeight: 'bold' }}>
          {operative.operativePayrollNumber}
        </span>
      </p>
      <p>
        OJAAT Enabled:{' '}
        <span style={{ color: '#090909', fontWeight: 'bold' }}>
          {operative.isOneJobAtATime ? 'TRUE' : 'FALSE'}
        </span>
      </p>
    </div>
  )
}

export default SelectedOperative

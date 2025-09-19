import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'

interface ContractListItemProps {
  contract: Contract
  index: number
  page: string
}

const ContractListItem = ({ contract, index, page }: ContractListItemProps) => {
  const dateDiffRoundedUp = () => {
    const todayTimestamp = new Date().getTime()

    const contractTerminationTimeStamp = new Date(
      contract.terminationDate
    ).getTime()
    const diffTime = Math.abs(todayTimestamp - contractTerminationTimeStamp)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <li
        data-id={index}
        style={{
          border: '5px solid #00664F',
          borderRadius: '20px',
          boxSizing: 'border-box',
          padding: '1rem',
          display: 'flex',
          marginTop: '1rem',
          justifyContent: 'center',
        }}
      >
        <div className="contract-details">
          <h5
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            {contract.contractReference}
          </h5>
          {page === 'contractor' && (
            <>
              <p>
                <span style={{ fontWeight: '600' }}>Sum of SORs:</span>{' '}
                {Intl.NumberFormat('en-UK', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(contract.sorCost)}
              </p>
              <p>
                <span style={{ fontWeight: '600' }}>SOR Count:</span>{' '}
                {contract.sorCount}
              </p>
              <p>
                <span style={{ fontWeight: '600' }}>
                  {contract.terminationDate < new Date().toISOString()
                    ? `Expired: `
                    : `Expires: `}
                </span>
                {dateToStr(contract.terminationDate)}
              </p>
            </>
          )}
          {page === 'dashboard' && (
            <>
              <p>{contract.contractorName}</p>
              <p>
                {contract.terminationDate < new Date().toISOString() ? (
                  <>
                    Expired:{' '}
                    <span style={{ fontWeight: '600' }}>
                      {dateDiffRoundedUp()} days ago
                    </span>
                  </>
                ) : (
                  <>
                    Expires:{' '}
                    <span style={{ fontWeight: '600' }}>
                      {dateToStr(contract.terminationDate)}
                    </span>
                  </>
                )}
              </p>
            </>
          )}
          {page === 'sorSearch' && (
            <>
              {contract.terminationDate < new Date().toISOString() ? (
                <p style={{ color: 'red' }}>
                  Expired: {dateToStr(contract.terminationDate)}
                </p>
              ) : (
                <p style={{ color: 'green' }}>Active</p>
              )}
            </>
          )}
        </div>
      </li>
    </>
  )
}

export default ContractListItem

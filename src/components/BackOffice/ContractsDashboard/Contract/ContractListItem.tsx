import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'

interface ContractListItemProps {
  contract: Contract
  index: number
  page: string
}

const ContractListItem = ({ contract, index, page }: ContractListItemProps) => {
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
                <span style={{ fontWeight: '600' }}>Expires:</span>{' '}
                {dateToStr(contract.terminationDate)}
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

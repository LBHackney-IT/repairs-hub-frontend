import Contract from '@/root/src/models/contract'
import ContractExpiryDisplay from './ContractExpiryDisplay'

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
              <ContractExpiryDisplay contract={contract} page={page} />
            </>
          )}

          {page === 'dashboard' && (
            <>
              <p>{contract.contractorName}</p>
              <ContractExpiryDisplay contract={contract} page={page} />
            </>
          )}

          {page === 'sorSearch' && (
            <>
              <ContractExpiryDisplay contract={contract} page={page} />
            </>
          )}
        </div>
      </li>
    </>
  )
}

export default ContractListItem

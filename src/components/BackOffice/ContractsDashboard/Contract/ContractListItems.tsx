import Contract from '@/root/src/models/contract'

import WarningInfoBox from '../../../Template/WarningInfoBox'
import ContractListItem from './ContractListItem'
import ErrorMessage from '../../../Errors/ErrorMessage'

interface Props {
  contracts: Contract[]
  warningText?: string
  error?: Error | string | null
  page: string
  activeStatus?: string
}

const ContractListItems = (props: Props) => {
  const { contracts, warningText, error, page, activeStatus } = props

  return (
    <>
      {(contracts === null || contracts?.length === 0) && (
        <div style={{ width: '90%' }}>
          <WarningInfoBox
            header="No contracts found!"
            text={`${warningText}`}
            name="no-contracts-found"
          />
        </div>
      )}

      {contracts?.length > 0 && (
        <ol
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 10rem)',
            gap: '1rem',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
          data-test-id={
            activeStatus ? `${activeStatus}-contracts-list` : 'contract-list'
          }
        >
          {contracts?.map((contract, index) => (
            <ContractListItem
              key={contract.contractReference}
              contract={contract}
              index={index}
              page={page}
            />
          ))}
        </ol>
      )}

      {error && (
        <ErrorMessage
          label={
            error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unexpected error occurred'
          }
        />
      )}
    </>
  )
}

export default ContractListItems

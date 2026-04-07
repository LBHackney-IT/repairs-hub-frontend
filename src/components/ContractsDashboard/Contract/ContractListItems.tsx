import Contract from '@/root/src/models/contract'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'

interface Props {
  contracts: Contract[]
  warningText?: string
  error?: Error | string | null
  activeStatus?: string
  children: React.ReactNode
}

export const ContractListItems = (props: Props) => {
  const { contracts, warningText, error, activeStatus, children } = props

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
          {children}
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

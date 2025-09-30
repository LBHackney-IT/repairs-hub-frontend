import Contract from '@/root/src/models/contract'
import ContractListItems from './ContractListItems'
import Spinner from '../../../Spinner'
import WarningInfoBox from '../../../Template/WarningInfoBox'
import ErrorMessage from '../../../Errors/ErrorMessage'

interface ContractSectionProps {
  heading: string
  contracts: Contract[]
  isLoading: boolean
  warningText: string
  error: Error
  page: string
  activeStatus?: string
}

const ContractSection = ({
  heading,
  contracts,
  isLoading,
  warningText,
  error,
  page,
  activeStatus,
}: ContractSectionProps) => {
  return (
    <>
      <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
        {heading}
      </h3>

      {isLoading && (
        <>
          <Spinner />
        </>
      )}

      {contracts === null || contracts?.length === 0 ? (
        <div style={{ width: '90%' }}>
          <WarningInfoBox
            header="No contracts found!"
            text={warningText}
            name="no-contracts-found"
          />
        </div>
      ) : (
        <ContractListItems
          contracts={contracts}
          page={page}
          activeStatus={activeStatus}
        />
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

export default ContractSection

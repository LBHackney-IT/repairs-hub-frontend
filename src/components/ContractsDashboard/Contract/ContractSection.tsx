import Contract from '@/root/src/models/contract'
import ContractListItems from './ContractListItems'
import Spinner from '../../Spinner'
import WarningInfoBox from '../../Template/WarningInfoBox'
import ErrorMessage from '../../Errors/ErrorMessage'
import { JSX } from 'react'

interface ContractSectionProps {
  heading?: string
  subHeading?: string
  contracts: Contract[]
  isLoading: boolean
  warningText: string | JSX.Element
  error: Error
  page: string
  activeStatus?: string
}

const ContractSection = ({
  heading,
  subHeading,
  contracts,
  isLoading,
  warningText,
  error,
  page,
  activeStatus,
}: ContractSectionProps) => {
  return (
    <>
      {heading && (
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          {heading}
        </h3>
      )}

      {isLoading && (
        <>
          <Spinner />
        </>
      )}

      {page === 'sorSearch' && contracts && contracts?.length > 0 && (
        <>
          <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
            {subHeading}
          </h3>
          <ContractListItems contracts={contracts} page="sorSearch" />
        </>
      )}

      {page !== 'sorSearch' && contracts && contracts?.length > 0 && (
        <ContractListItems
          contracts={contracts}
          page={page}
          activeStatus={activeStatus}
        />
      )}

      {contracts === null ||
        (contracts?.length === 0 && (
          <div style={{ width: '90%' }}>
            <WarningInfoBox
              header="No contracts found!"
              text={warningText}
              name="no-contracts-found"
            />
          </div>
        ))}

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

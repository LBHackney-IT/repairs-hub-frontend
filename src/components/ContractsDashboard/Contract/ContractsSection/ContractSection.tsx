import Contract from '@/root/src/models/contract'
import Spinner from '../../../Spinner'
import ErrorMessage from '../../../Errors/ErrorMessage'
import { JSX } from 'react'
import { SorSearchContractListItems } from '../SorSearchContractListItems'
import { NoContractsFoundMessage } from './NoContractsFoundMessage'

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

interface Props {
  heading: string
  children: JSX.Element
  error: Error
  isLoading: boolean
}

export const ContractsSectionWrapper = (props: Props) => {
  const { heading, children, error, isLoading } = props

  return (
    <>
      <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
        {heading}
      </h3>

      {isLoading ? <Spinner /> : <span>{children}</span>}

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
      <ContractsSectionWrapper
        heading={heading}
        isLoading={isLoading}
        error={error}
      >
        <>
          {page === 'sorSearch' && contracts && contracts?.length > 0 && (
            <>
              <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
                {subHeading}
              </h3>
              <SorSearchContractListItems contracts={contracts} />
            </>
          )}


          {contracts === null ||
            (contracts?.length === 0 && (
              <NoContractsFoundMessage warningText={warningText} />
            ))}
        </>
      </ContractsSectionWrapper>
    </>
  )
}

export default ContractSection

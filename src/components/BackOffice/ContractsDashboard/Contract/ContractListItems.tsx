import Contract from '@/root/src/models/contract'

import WarningInfoBox from '../../../Template/WarningInfoBox'
import ContractListItem from './ContractListItem'
import ErrorMessage from '../../../Errors/ErrorMessage'

interface ContractListItemsProps {
  contracts: Contract[]
  heading: string
  warningText: string
  error?: Error | string | null
  page: string
}

const ContractListItems = ({
  contracts,
  heading,
  warningText,
  error,
  page,
}: ContractListItemsProps) => {
  if (contracts === null || contracts?.length === 0) {
    return (
      <>
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          {heading}
        </h3>
        <div style={{ width: '85%' }}>
          <WarningInfoBox
            header="No contracts found!"
            text={`${warningText}`}
            name="No contracts found"
          />
        </div>
      </>
    )
  }
  if (error) {
    return (
      <>
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          {heading}
        </h3>
        <ErrorMessage
          label={
            error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unexpected error occurred'
          }
        />
      </>
    )
  }

  return (
    <ol className="lbh-list mobile-working-work-order-list">
      <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
        {heading}
      </h3>
      {contracts?.map((contract, index) => (
        <ContractListItem
          key={contract.contractReference}
          contract={contract}
          index={index}
          page={page}
        />
      ))}
    </ol>
  )
}

export default ContractListItems

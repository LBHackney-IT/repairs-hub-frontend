import { useEffect } from 'react'
import cx from 'classnames'

import { dateToStr } from '@/root/src/utils/date'
import Contract from '@/root/src/models/contract'
import WarningInfoBox from '../../../Template/WarningInfoBox'

interface ContractListItemsProps {
  contracts: Contract[]
}

const ContractListItems = ({ contracts }: ContractListItemsProps) => {
  const today = new Date()
  const twoMonthsFromNow = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    today.getDate()
  )

  const contractsDueToExpireInTwoMonths = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) > today &&
      new Date(contract.terminationDate) < twoMonthsFromNow
    )
  })

  if (
    contractsDueToExpireInTwoMonths === null ||
    contractsDueToExpireInTwoMonths?.length === 0
  ) {
    return (
      <>
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contracts due to expire soon:
        </h3>
        <div style={{ width: '85%' }}>
          <WarningInfoBox
            header="No contracts found!"
            text="No contracts expiring in the next two months."
          />
        </div>
      </>
    )
  }
  return (
    <div>
      <ol className="lbh-list mobile-working-work-order-list">
        <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
          Contracts due to expire soon:
        </h3>
        {contractsDueToExpireInTwoMonths?.map((contract, index) => (
          <>
            <li
              data-id={index}
              style={{
                cursor: 'pointer',
                border: '5px solid #00664F',
                borderRadius: '20px',
                width: '85%',
              }}
              className={cx(
                'govuk-!-margin-top-3',
                'operative-work-order-list-item'
              )}
            >
              <div className="contract-details">
                <p key={index}>
                  {`${contract.contractReference} |  ${
                    contract.contractorName
                  } | ${dateToStr(contract.terminationDate)}`}
                </p>
              </div>
            </li>
          </>
        ))}
      </ol>
    </div>
  )
}

export default ContractListItems

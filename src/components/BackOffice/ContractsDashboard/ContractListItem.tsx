import Link from 'next/link'
import cx from 'classnames'

import { dateToStr } from '@/root/src/utils/date'
import Contract from '@/root/src/models/contract'

interface ContractListItemProps {
  contract: Contract
  index: number
}

const ContractListItem = ({ contract, index }: ContractListItemProps) => {
  return (
    <Link href={`/backoffice/contracts/${contract.contractReference}`}>
      <li
        data-id={index}
        style={{
          cursor: 'pointer',
          border: '5px solid #00664F',
          borderRadius: '20px',
          width: '85%',
        }}
        className={cx('govuk-!-margin-top-3', 'operative-work-order-list-item')}
      >
        <div className="contract-details">
          <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-bottom-1">
            Reference:{' '}
            <span style={{ fontWeight: 400 }}>
              {contract.contractReference}
            </span>
          </h3>
          <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
            <strong>Contractor:</strong>{' '}
            <span className="capitalize"> {contract.contractorName}</span>
          </p>
          <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
            <strong>Contractor Code:</strong> {contract.contractorReference}
          </p>
          <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
            <strong>Active:</strong> {dateToStr(contract.effectiveDate)} -{' '}
            {dateToStr(contract.terminationDate)}
          </p>
          <p className="govuk-!-margin-0 govuk-!-margin-bottom-1">
            <strong>Count of SORs:</strong> {contract.sorCount}
          </p>
          <p className="govuk-!-margin-0">
            <strong>Sum of SORs:</strong>{' '}
            {Intl.NumberFormat('en-UK', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(contract.sorCost)}
          </p>
        </div>
        <div className="govuk-!-margin-0">
          <span className="arrow right"></span>
        </div>
      </li>
    </Link>
  )
}

export default ContractListItem
